export const addUser = (name,token) => dispatch => {
	//mongo post to database, return users once youre done
	var userName = name;
	var userToken = token;
	fetch('/api/adduser',{
        method: 'POST',
        // body: JSON.stringify({
        //   name: name,
        //   token: token
        // }),
        body: JSON.stringify({
        	name: userName,
        	token: userToken
        }),
        headers: {
        	"Content-Type": "application/json"
        }
      })
      .then(function(res){
        return res.json();
      })
      .then(function(resJSON){
      	//console.log(resJSON);
      	var users = resJSON;
      	dispatch({
			type: 'ADD_USER',
			payload: users
		});
       
      });
	

}