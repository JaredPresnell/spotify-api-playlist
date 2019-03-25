import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import hashParamsReducer from './hashParamsReducer';
import querySettingsReducer from './querySettingsReducer';
import usersReducer from './usersReducer';

export default combineReducers({
  tracks: tracksReducer,
  hashParams: hashParamsReducer,
  settings: querySettingsReducer,
  users: usersReducer,
});
