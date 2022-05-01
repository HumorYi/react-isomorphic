import axios from 'axios';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { CLIENT_BASE_URL } from '../../config';
import indexReducer from './home';
import userReducer from './user';

const clientAxios = axios.create({ baseURL: CLIENT_BASE_URL });

export const reducer = combineReducers({
  index: indexReducer,
  user: userReducer,
});

export const middleware = (arg) => {
  return applyMiddleware(thunk.withExtraArgument(arg));
};

export const generateStore = ($axios, defaultState = {}) => {
  return createStore(reducer, defaultState, middleware($axios));
};

export const getClientStore = () => generateStore(clientAxios, window.__store);
