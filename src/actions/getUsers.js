/* 
  src/actions/getUsers.js
*/
export const getUsers = () => dispatch => {
	//fetch('/api/getusers')
    fetch('/api/getusers')
  .then(function(res){
    return res.json();
  })
  .then(function(resJSON){
    console.log(resJSON);
    dispatch({
    	type: 'GET_USERS',
    	payload: resJSON
    })
    return resJSON;
  });

}
