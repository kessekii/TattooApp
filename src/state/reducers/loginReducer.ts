import { UserInterface } from '../../models/model.interface'
import { ActionType } from '../action-types/index'
import { Action } from '../actions'

export interface loginReducerInterface {
	ok: boolean;
	user: UserInterface;
}

const initialState: loginReducerInterface = {
	ok: false,
	user: { name: '', role: '', token: '', email: '', department: 'tech' },
};

const reducer = (
	state: loginReducerInterface = initialState,
	action: Action
): loginReducerInterface => {
	switch (action.type) {
		case ActionType.LOGIN:


			return action.payload
		case ActionType.LOGOUT:
			return {
				...state,
				user: { name: '', role: '', token: '', email: '', department: 'tech' },
			}
		default:
			return state
	}
}

export default reducer
