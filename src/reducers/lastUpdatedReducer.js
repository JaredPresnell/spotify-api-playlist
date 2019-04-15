/* 	
  src/reducers/lastUpdatedReducer.js
*/
export default (state ='', action) => {
  switch (action.type) {
    case 'SET_LAST_UPDATED':
		return action.payload
    default:
      return state
  }
}
