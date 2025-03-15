import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    id:null,
    email:null,
    firstName:null,
    lastName:null,
    publicKey:null,
    loading:null,
    error:null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUserStart(state) {
            state.loading = true;
            state.error = null;
          },
        setUserSuccess(state, action) {
            state.loading = false;
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.publicKey = action.payload.publicKey;
            state.error = null
        },
        setUserFailure(state,action) {
            state.loading = false;
            state.error = action.payload;
        },
        setUserUpdate(state,action){
            const {field, value} = action.payload;
            state[field] = value;
        },
        clearUser(state,action) {
            return initialState;
        }
    }
})

export const {setUserStart, setUserSuccess, setUserFailure, setUserUpdate, clearUser} = userSlice.actions

export default userSlice.reducer