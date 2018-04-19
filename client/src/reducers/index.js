import { combineReducers } from 'redux';
import coinReducer from './coinReducer';
import avatarReducer from './avatarReducer';
import navReducer from './navReducer';

const reducers = combineReducers({
  coinReducer,
  avatarReducer,
  navReducer
})

export default reducers;