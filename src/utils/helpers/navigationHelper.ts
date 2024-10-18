import { userParams } from '../../state/action-creators'
import { loginReducerInterface } from '../../state/reducers/loginReducer'


export const fetchData = async (
	login: loginReducerInterface,
	getAction: any,
	data: any,
) => {
	const headers: userParams = {
		Authorization: `Token ${login.user.token}`,
	}
	await getAction(headers)

}
