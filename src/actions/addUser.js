export const addUser = (name,accessToken, refreshToken) => dispatch => {
	//mongo post to database, return users once youre done
  //console.log('refresh token from addusers.js ' + refreshToken);
	fetch('/api/adduser',{
        method: 'POST',
        body: JSON.stringify({
        	name: name,
        	accessToken: accessToken,
          refreshToken: refreshToken
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