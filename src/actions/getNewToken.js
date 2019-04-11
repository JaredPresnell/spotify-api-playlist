export const getNewToken = (refreshToken) => dispatch => {
  //console.log('refreshToken');
  fetch('/spotify/refresh_token?refresh_token=' + refreshToken, {
    method: 'GET',
  })  
  .then(function(res){
    return res.json ();
  })
  .then(function(response){

    
    //post to database
    //this might be weird as in maybe it should post to database and then grab it from database rather than update local state
     // how often are you like calling a database?
     console.log('DISPATCH');
     dispatch({
          type: 'NEW_TOKEN',
          payload: response 
        });
    console.log('fetching to database');
    fetch('/api/edituser',{
        //need to pass in info to db.collection.find() a single user and update info
        // refresh tokens should technically be unique
        method: 'POST',
        body: JSON.stringify({
          accessToken: response.access_token,
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
        console.log(resJSON);
      });
  

    // dispatch({
    //   type: 'NEW_TOKEN',
    //   payload: response 
    // });

  });	

}
