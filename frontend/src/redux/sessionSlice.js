import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    session_id: ''
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.session_id = action.payload;
        },
        clearSession: (state) => {
            state.session_id = '';
        },
    },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
