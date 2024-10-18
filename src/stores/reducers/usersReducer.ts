import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Ensure this import correctly matches your file structure

interface UserState {
    user: {
        email: string;
    } | null;
}

const initialState: UserState = {
    user: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ email: string }>) => {
            state.user = { email: action.payload.email };
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser: login, setUser: register, clearUser: logout } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;

export default usersSlice.reducer;
