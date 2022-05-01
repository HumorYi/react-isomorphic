const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
}

// test();

const urlCache = {};

app.get('*', async (req, res) => {
  const url = req.url;

  // 1.加缓存  2. lru 缓存算法
  if (urlCache[url]) return res.send(urlCache[url]);

  // 对 seo 无影响
  if (url === '/favicon.ico') return res.send({ code: 0 });

  const targetUrl = 'http://localhost:9099' + url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(targetUrl, {
    waitUntil: ['networkidle0'],
  });
  const html = await page.content();

  urlCache[targetUrl] = html;

  res.send(html);
});

app.listen(8081, () => {
  console.log('other ssr server start');
});
