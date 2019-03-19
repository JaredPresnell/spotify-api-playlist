import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import hashParamsReducer from './hashParamsReducer';
import querySettingsReducer from './querySettingsReducer';
export default combineReducers({
  tracks: tracksReducer,
  hashParams: hashParamsReducer,
  settings: querySettingsReducer
});