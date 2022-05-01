import React from 'react';
import Home from '../pages/Home';
import About from '../pages/About';
import User from '../pages/User';
import NotFound from '../pages/NotFound';

const routes = [
  {
    path: '/',
    title: '首页',
    element: <Home />,
  },
  {
    path: '/about',
    title: '关于我们',
    element: <About />,
  },
  {
    path: '/user',
    title: '用户中心',
    element: <User />,
  },
  {
    path: '*',
    title: '404',
    element: <NotFound />,
  },
];

export { routes };
