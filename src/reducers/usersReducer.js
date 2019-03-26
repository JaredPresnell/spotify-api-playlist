/* 
  src/reducers/usersReducer.js
*/
export default (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      	return action.payload
    case 'ADD_USER':
    	return action.payload
    case 'NEW_TOKEN':
    	var newState = {...state};
    	newState[0].accessToken = action.payload.access_token;
    	return newState;
    default:
      	return [{name:'',accessToken:'',refreshToken:''}]
  }
}
