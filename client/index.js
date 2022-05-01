import React from 'react';

import { hydrateRoot, createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './src/App';
import { getClientStore } from './src/store';

const store = getClientStore();

const Page = (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

const root = document.getElementById('root');

if (window.__store) {
  // ssr 服务端已渲染入口，客户端只需要注入即可
  hydrateRoot(root, Page);
} else {
  // csr
  createRoot(root).render(Page);
}
