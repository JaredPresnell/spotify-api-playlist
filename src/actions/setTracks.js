/* 
  src/actions/getTracks.js
*/
export const setTracks = (tracks) => dispatch => {
	dispatch({
		type: 'SET_TRACKS',
		payload: tracks.items
	})
}
