/* 
  src/reducers/usersReducer.js
*/
export default (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      	return action.payload
    case 'ADD_USER':
    	return action.payload
    default:
      	return []
  }
}
