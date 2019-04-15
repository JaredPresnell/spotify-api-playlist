import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import hashParamsReducer from './hashParamsReducer';
import querySettingsReducer from './querySettingsReducer';
import usersReducer from './usersReducer';
import lastUpdatedReducer from './lastUpdatedReducer';

export default combineReducers({
  tracks: tracksReducer,
  lastUpdated: lastUpdatedReducer,
  hashParams: hashParamsReducer,
  settings: querySettingsReducer,
  users: usersReducer,
});
