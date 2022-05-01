import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getList } from '../../store/home';
import { ssrLoadData } from '../../utils';
import styles from './index.module.css';

function Home(props) {
  const { list, getList } = props;

  useEffect(() => {
    !list.length && getList();
  }, []);

  return (
    <div>
      <h3 className={styles.title}>Home</h3>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

ssrLoadData(Home, ({ dispatch }) => dispatch(getList()));

export default connect(({ index: { list } }) => ({ list }), {
  getList,
})(Home);
