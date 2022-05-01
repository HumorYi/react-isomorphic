import React from 'react';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import proxy from 'express-http-proxy';

import path from 'path';
import fs from 'fs';

import App from '../client/src/App';
import { getServerStore } from './store';
import { routes } from '../client/src/router';
import config, { CLIENT_PROXY_PREF, SERVER_BASE_URL } from './config';

const app = express();
const store = getServerStore();

const csrRender = function (res) {
  // 读取 csr 文件，返回
  const filename = path.resolve(process.cwd(), 'public/index.csr.html');
  const html = fs.readFileSync(filename, 'utf-8');
  return res.send(html);
};

const isOpenCsr = (config, req) => config.csr || req.query._mode === 'csr';

const getHtmlTmp = (req, store) => {
  const Page = (
    <React.StrictMode>
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    </React.StrictMode>
  );

  const htmlTmpFront = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>react ssr</title>
      <!--加载css-->
      <style></style>
    </head>
    <body>
      <div id="root">
  `;

  const htmlTmpEnd = `
      </div>
      <script>
        <!--服务端调用客户端异步获取数据方法，作为客户端初始store-->
        window.__store = ${JSON.stringify({ ...store.getState() })}
      </script>
      <!--加载客户端-->
      <script src="/bundle.js"></script>
    </body>
  </html>
  `;

  return { Page, htmlTmpFront, htmlTmpEnd };
};

app.use(express.static('public'));

// 代理方式一，代码长
/* app.use(
  CLIENT_PROXY_PREFIX,
  createProxyMiddleware({
    target: SERVER_BASE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  }),
); */

// 代理方式二，代码短
app.use(CLIENT_PROXY_PREF, proxy(SERVER_BASE_URL));

app.get('*', (req, res) => {
  // 服务器负载过高 开启 csr 或 配置开关开启 csr 或 url 参数开启 csr 降级渲染
  if (isOpenCsr(config, req)) return csrRender(res);

  // 流式渲染，加快渲染速度，客户端请求ajax
  if (!config.injectAjax) {
    const { Page, htmlTmpFront, htmlTmpEnd } = getHtmlTmp(req, store);

    const { pipe } = renderToPipeableStream(Page, {
      onShellReady() {
        res.write(htmlTmpFront);

        pipe(res);

        res.write(htmlTmpEnd);
      },
    });

    return;
  }

  // 获取根据路由渲染出来的组件，并且拿到 loadData 方法，获取数据
  const promises = [];

  routes.some((route) => {
    const match = matchPath(req.path, route.path);

    if (match && route.element) {
      const { loadData } = route.element.type;
      if (loadData) {
        // 接口错误降级处理，避免错误导致页面崩溃

        // 方式一：外面包一层promise，无论错或对都认为是对的，错误部分可考虑用错误图片或日志代替
        // promises.push(
        //   new Promise((resolve, reject) => {
        //     loadData(store).then(resolve).catch(resolve);
        //   }),
        // );

        promises.push(loadData(store));
      }
    }

    return match;
  });

  // 接口错误降级处理，避免错误导致页面崩溃
  // 方式二：使用 Promise.allSettled 代替 Promise.all

  // 待所有请求结束后再渲染
  Promise.allSettled(promises)
    .then(() => {
      const { Page, htmlTmpFront, htmlTmpEnd } = getHtmlTmp(req, store);

      // 服务端与客户端渲染同一个组件入口，达到同构目的
      return res.send(htmlTmpFront + renderToString(Page) + htmlTmpEnd);
    })
    .catch(() => {
      res.send('出错了！');
    });
});

app.listen(9099, () => console.log('server listen'));
