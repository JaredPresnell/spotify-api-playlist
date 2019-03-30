/* 
  src/reducers/tracksReducer.js
*/
export default (state =[], action) => {
  switch (action.type) {
    case 'SET_TRACKS':
    	console.log('tracksReducer.js');
    	console.log(action.payload);
		return action.payload
    default:
      return state
  }
}
