/* 
  src/actions/incrementCount.js
*/
export const incrementCount = () => dispatch => {
	dispatch({
		type: 'INCREMENT_COUNT'
	})
}
