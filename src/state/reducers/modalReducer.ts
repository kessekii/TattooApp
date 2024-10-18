// redux/reducers/modalReducer.ts
import { ActionType } from '../action-types/index';
import { ModalData } from '../action-creators';

interface ModalState {
  modal: ModalData | null;
  isModalOpen: boolean;
}

const initialState: ModalState = {
  modal: null,
  isModalOpen: false,
};

const modalReducer = (state: ModalState = initialState, action: { type: string; payload?: any }): ModalState => {
  switch (action.type) {
    case ActionType.OPEN_MODAL:
      return {
        ...state,
        modal: action.payload,
        isModalOpen: true,
      };

    case ActionType.CLOSE_MODAL:
      const { shouldCancel } = action.payload || {};
      if (shouldCancel && state.modal?.onCancel) {
        state.modal.onCancel();
      }
      return {
        ...state,
        modal: null,
        isModalOpen: false,
      };

    case ActionType.SET_MODAL_OPEN_STATE:
      return {
        ...state,
        isModalOpen: action.payload,
      };

    case ActionType.SET_MODAL_CONFIRM:
      const shouldCloseModal = state.modal?.onConfirm ? state.modal.onConfirm(action.payload) : true;

      if (shouldCloseModal) {
        return {
          ...state,
          modal: null,
          isModalOpen: false,
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default modalReducer;