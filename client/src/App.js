import React, { Suspense, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './router';
import Loading from './components/Loading';
import Header from './components/Header';
import './App.css';

export default function App(props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>react ssr</h1>
      <p>count is {count}</p>
      <button onClick={() => setCount(count + 1)}>increment</button>
      <hr />
      <Header />
      <hr />
      <Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
    </div>
  );
}
