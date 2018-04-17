import { combineReducers } from 'redux';
import coinReducer from './coinReducer';

const reducers = combineReducers({
  coinReducer,
})

export default reducers;