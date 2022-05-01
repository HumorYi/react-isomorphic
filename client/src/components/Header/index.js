import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../router';
import styles from './index.module.css';

function Header(props) {
  const navigate = useNavigate();

  function handleHistory(url) {
    startTransition(() => navigate(url));
  }

  return (
    <ul className={styles.main}>
      {routes
        .filter((route) => route.path && route.path !== '*')
        .map((route) => (
          <li
            key={route.path}
            onClick={() => handleHistory(route.path)}
            className={styles.li}
          >
            {route.title}
          </li>
        ))}
    </ul>
  );
}
export default Header;
