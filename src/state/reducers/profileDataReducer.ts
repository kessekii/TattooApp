import { UserInterface } from '../../models/model.interface'
import { ActionType } from '../action-types/index'
import { Action } from '../actions'



const initialState =  {
	name: 'John Doe',
	username: 'jondoe',
	type: 'Master',
	location: 'New York City',
	description: 'Photographer | Traveler',
	profilePicture: 'profile-picture.jpg',
	posts: [

	],
	reviews: [
		{ photo: 'client1.jpg', nickname: 'Alice', text: 'Amazing photographer!', mark: 5 },
		{ photo: 'client2.jpg', nickname: 'Alice', text: 'Loved the pictures!', mark: 4 },
		{ photo: 'client3.jpg', nickname: 'Alice', text: 'Great experience.', mark: 5 },
	],
	friends: [
		{ avatar: 'friend1.jpg', nickname: 'Alice', username: 'alice' },
		{ avatar: 'friend2.jpg', nickname: 'Bob', username: 'bob' },
		{ avatar: 'friend3.jpg', nickname: 'Charlie', username: 'charlie' },
		{ avatar: 'friend4.jpg', nickname: 'Dave', username: 'dave' },
	],
	socialLinks: [
		{ platform: 'Instagram', url: 'https://www.instagram.com' },
		{ platform: 'Facebook', url: 'https://www.facebook.com' },
		{ platform: 'Twitter', url: 'https://www.twitter.com' },
		{ platform: 'LinkedIn', url: 'https://www.linkedin.com' },
	],
	calendar: [
		{ date: '2024-10-01', hours: ['5', '7'] },
		{ date: '2024-10-02', hours: ['5', '6', '7'] },
		{ date: '2024-10-04', hours: ['5', '6', '7'] },
	],
	map: [],
};

const reducer = (
	state: any = initialState,
	action: Action
): any => {
	switch (action.type) {
		case ActionType.GETPROFILEDATA:


			return action.payload
		
		default:
			return state
	}
}

export default reducer
