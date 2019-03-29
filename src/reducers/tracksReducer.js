/* 
  src/reducers/tracksReducer.js
*/
export default (state =[], action) => {
  switch (action.type) {
    case 'SET_TRACKS':
		return action.payload
    default:
      return state
  }
}
