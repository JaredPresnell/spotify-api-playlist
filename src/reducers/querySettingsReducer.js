/* 
  src/reducers/querySettingsReducer.js
*/
const defaultSettingsState = {
	count: 5,
	timeFrame: 'short_term'
}
export default (state = defaultSettingsState, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNT':
		return {
			...state, 
			count: state.count+1
		}
	case 'DECREMENT_COUNT':
		return {
			...state,
			count: state.count-1
		}
	case 'TOGGLE_TIME_FRAME':
		var timeFrame = state.timeFrame;
		if(timeFrame === 'short_term')
			timeFrame = 'medium_term';
		else if(timeFrame === 'medium_term')
			timeFrame = 'long_term';
		else if (timeFrame === 'long_term')
			timeFrame = 'short_term';
		return {
			...state,
			timeFrame: timeFrame
		}
    default:
      return state
  }
}
