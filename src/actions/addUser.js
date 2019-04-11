export const addUser = (id, name,accessToken, refreshToken) => dispatch => {
	fetch('/api/adduser',{
        method: 'POST',
        body: JSON.stringify({
          spotifyId: id,
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
