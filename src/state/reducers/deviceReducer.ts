import { ActionType } from '../action-types/index';
import { BREAKPOINTS } from '../../utils/constraints';

const initialState = {
  currentBreakpoint: BREAKPOINTS.xs,
  isLandscape: false,
  isProfileMenuOpen: false,
  mobileOverlayIds: [],
};

const deviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_CURRENT_BREAKPOINT:
      return {
        ...state,
        currentBreakpoint: action.payload,
      };

    case ActionType.TOGGLE_PROFILE_MENU:
      return {
        ...state,
        isProfileMenuOpen: !state.isProfileMenuOpen,
      };

    case ActionType.ADD_MOBILE_OVERLAY:
      return {
        ...state,
        mobileOverlayIds: [...state.mobileOverlayIds, action.payload],
      };

    case ActionType.REMOVE_MOBILE_OVERLAY:
      return {
        ...state,
        mobileOverlayIds: state.mobileOverlayIds.filter(id => id !== action.payload),
      };

    default:
      return state;
  }
};

export default deviceReducer;