import * as actionTypes from '../actions/actionTypes';
import { AsyncStorage } from 'react-native';

function coinReducer(state = {option: {}}, action){
  switch(action.type){
    case actionTypes.SET_OPTION: {
      
      const newOption = Object.assign({}, state.option, action.option);
      AsyncStorage.setItem('option', JSON.stringify(newOption));

      return {...state, option: newOption};
    }

    default:
      return {...state};
  }
}

export default coinReducer;