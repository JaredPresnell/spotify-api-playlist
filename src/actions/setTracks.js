/* 
  src/actions/getTracks.js
*/
export const setTracks = (tracks) => dispatch => {
	var test = 'test';
	dispatch({
		type: 'SET_TRACKS',
		payload: tracks.items
	})
}
