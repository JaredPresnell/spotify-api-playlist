/* 
  src/reducers/usersReducer.js
*/
 
const initialState = [{spotifyId: '', name:'',accessToken:'',refreshToken:''}];  
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS':
      	return action.payload
    case 'ADD_USER':
    	return action.payload
    case 'EDIT_USER':
    	var newState = {...state};

    	//newState[0].accessToken = action.payload.access_token;
    	return state
    default:
      	return state
  }
}
