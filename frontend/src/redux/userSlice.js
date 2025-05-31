import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    client: {
        document: '',
        email: '',
        id: '',
        name: '',
        phone: ''
    },
    token: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const {client, token} = action.payload;
            state.client.id = client.id;
            state.client.document = client.document;
            state.client.email = client.email;
            state.client.name = client.name;
            state.client.phone = client.phone;
            state.token = token;
        },
        logout: (state) => {
            state.client.id = '';
            state.client.document = '';
            state.client.email = '';
            state.client.name = '';
            state.client.phone = '';
            state.token = '';
        },
    },
});

export const {setUser, logout} = userSlice.actions;
export default userSlice.reducer;
