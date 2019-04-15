/* 
  src/actions/setLastUpdated.js
*/
export const setLastUpdated = (lastUpdated) => dispatch => {
	dispatch({
		type: 'SET_LAST_UPDATED',
		payload: lastUpdated
	})
}
