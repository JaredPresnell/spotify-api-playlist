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
  	//i could get the params, then i could call to spotify, then i could dispatch to users
  	if(!isEmpty(params))
  		//and here we will be doing something undoubtedly
  		// aka call to spotify, get the username, dispatch that bitch
	dispatch({
		type: 'GET_HASH_PARAMS',
		payload: params
	})
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}