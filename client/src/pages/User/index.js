import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from '../../store/user';
import { ssrLoadData } from '../../utils';

function User(props) {
  const { userInfo, getUserInfo } = props;

  useEffect(() => {
    !Object.keys(userInfo).length && getUserInfo();
  }, []);

  return (
    <div>
      <h3>User</h3>
      <p>{userInfo.name}</p>
    </div>
  );
}

ssrLoadData(User, ({ dispatch }) => dispatch(getUserInfo()));

export default connect(({ user: { userInfo } }) => ({ userInfo }), {
  getUserInfo,
})(User);
