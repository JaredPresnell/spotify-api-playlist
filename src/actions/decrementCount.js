/* 
  src/actions/decrementCount.js
*/
export const decrementCount = () => dispatch => {
	dispatch({
		type: 'DECREMENT_COUNT'
	})
}
