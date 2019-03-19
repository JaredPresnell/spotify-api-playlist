/* 
  src/reducers/hashParamsReducer.js
*/
export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_HASH_PARAMS':
      return action.payload
    default:
      return state
  }
}
