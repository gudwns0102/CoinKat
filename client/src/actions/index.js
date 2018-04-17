import * as actionTypes from './actionTypes';

function setOption(option){
  return {
    type: actionTypes.SET_OPTION,
    option,
  }
}

export {
  setOption,
}