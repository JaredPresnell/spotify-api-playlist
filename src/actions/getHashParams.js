/* 
  src/actions/getHashParams.js
*/
export const getHashParams = () => dispatch => {
	function getParams() {
	    var hashParams = {};
	    var e, r = /([^&;=]+)=?([^&;]*)/g,
	        q = window.location.hash.substring(1);
	    while ( e = r.exec(q)) {
	       hashParams[e[1]] = decodeURIComponent(e[2]);
	    }
	    return hashParams;
  	}
  	var params = getParams();
	dispatch({
		type: 'GET_HASH_PARAMS',
		payload: params
	})
}
