/* 
  src/actions/getUsers.js
*/
export const getUsers = () => dispatch => {
	// fetch('/api/updateusers',{
	// 	method: 'POST',
	// 	body: JSON.stringify({
	// 	  post: 'here we are testing again'
	// 	}),
	// })
	// .then(function(res){
	// 	return res.json();
	// })
	// .then(function(resJSON){
	// 	//console.log(resJSON)
	// 	// return resJSON;
	// 	dispatch({
	// 		type: 'GET_USERS',
	// 		payload: resJSON
	// 	})
	// });
	fetch('/api/getusers')
      .then(function(res){
        return res.json();
      })
      .then(function(resJSON){
    	dispatch({
			type: 'GET_USERS',
			payload: resJSON
		})
      });

}