export const editUser = (name, accessToken, refreshToken) => dispatch => {
	console.log('edituser.js');
	dispatch({
      type: 'EDIT_USER',
      name: name,
      refreshToken: refreshToken,
      accessToken: accessToken
    });
}	