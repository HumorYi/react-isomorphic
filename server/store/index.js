import axios from 'axios';
import { generateStore } from '../../client/src/store';
import { SERVER_BASE_URL } from '../config';

const serverAxios = axios.create({ baseURL: SERVER_BASE_URL });

export const getServerStore = () => generateStore(serverAxios);
