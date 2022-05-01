// actionType
const GET_USER_INFO = 'GET_USER_INFO';

// actionCreator
const changeUserInfo = (userInfo) => ({ type: GET_USER_INFO, userInfo });

export const getUserInfo = (server) => {
  return (dispatch, getState, $axios) => {
    return $axios
      .get('/user_info')
      .then(({ data: { userInfo } }) => dispatch(changeUserInfo(userInfo)));
  };
};

const defaultState = { userInfo: {} };

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return { ...state, userInfo: action.userInfo };
    default:
      return state;
  }
};
