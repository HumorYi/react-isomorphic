// actionType
const GET_LIST = 'GET_LIST';

// actionCreator
const changeList = (list) => ({ type: GET_LIST, list });

export const getList = (server) => {
  return (dispatch, getState, $axios) => {
    return $axios
      .get('/home_list')
      .then(({ data: { list } }) => dispatch(changeList(list)));
  };
};

const defaultState = { list: [] };

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_LIST:
      return { ...state, list: action.list };
    default:
      return state;
  }
};
