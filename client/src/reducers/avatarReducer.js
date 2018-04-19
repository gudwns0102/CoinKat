import * as actionTypes from '../actions/actionTypes';
import { AsyncStorage } from 'react-native';

function avatarReducer(state = {avatar: null}, action){
  switch(action.type){
    case actionTypes.SET_AVATAR: {
      AsyncStorage.setItem('avatar', action.coinName);
      return {...state, avatar: action.coinName};
    }

    default:
      return {...state};
  }
}

export default avatarReducer;