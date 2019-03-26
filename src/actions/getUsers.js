/* 
  src/actions/getUsers.js
*/
export const getUsers = () => dispatch => {
	function reqListener () {
		var users = JSON.parse(this.responseText);
		dispatch({
			type: 'GET_USERS',
			payload: users
		});
	}

	var xhttp = new XMLHttpRequest();
	xhttp.addEventListener("load", reqListener);
	xhttp.open("GET", "/api/getusers", true);
	xhttp.send();


}