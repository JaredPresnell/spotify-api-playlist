export const addUser = (id, name,accessToken, refreshToken) => dispatch => {
  console.log('inside addUser.js');
	return fetch('/api/adduser',{
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
      	//** literally what am i doing
        dispatch({
          type: "ADD_USER", 
          payload: {spotifyId: resJSON.spotifyId, name: resJSON.name, accessToken: resJSON.accessToken, refreshToken: resJSON.refreshToken}      
        });
        console.log('addUser.js then, i sure hope its tracks');
        console.log(resJSON); 
        return resJSON;      
      });
	

}
