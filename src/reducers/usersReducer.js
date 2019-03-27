/* 
  src/reducers/usersReducer.js
*/

export default (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      	return action.payload
    case 'ADD_USER':
    	return action.payload
    case 'EDIT_USER':
      console.log(action.name);
      console.log(action.accessToken);
      console.log(action.refreshToken);
    	var newState = {...state};

    	//newState[0].accessToken = action.payload.access_token;
    	return [{name:'',accessToken:'',refreshToken:''}];
    default:
      	return [{name:'',accessToken:'',refreshToken:''}]
  }
}
