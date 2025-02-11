        import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
        import axios from "axios";

        const API_URL = process.env.NEXT_PUBLIC_API_URL; 

        export const signupUser = createAsyncThunk(
            'auth/signup',
            async(userData,{rejectWithValue})=>{
                try {
        
                    const response = await axios.post(`https://tsm.fayisnambiyath.in/api/users/register`, userData);
                
                    
            return response.data; 
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
        )
        export const loginUser = createAsyncThunk(
            'auth/login',
            async(userData,{rejectWithValue})=>{
                try {
                    const response = await axios.post(`https://tsm.fayisnambiyath.in/api/users/login`, userData);
            return response.data; 
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
        )
        export const otpofUser = createAsyncThunk(
            'auth/otp',
            async(userData,{rejectWithValue})=>{
                try {
                    console.log(userData);
                    
                    const response = await axios.post(`https://tsm.fayisnambiyath.in/api/users/verify-otp`, userData);
            return response.data; 
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
        )

        const authSlice = createSlice({
            name:'auth',
            initialState: {
                user: null,
                loading: false,
                isAuthenticated:false,
                error: null,
            },
            reducers: {
                logout: (state) => {
                    state.user = null;
                    state.isAuthenticated = false;  // Ensure authentication state is cleared
                    localStorage.removeItem("token"); // Remove stored auth token if any
                },
                
                clearError:(state) =>{
                    state.error = null
                }
            },
            extraReducers: (builder) => {
                builder
                .addCase(signupUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(signupUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                })
                .addCase(signupUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(loginUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload.user;
                    localStorage.setItem("token", action.payload.token);
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(otpofUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(otpofUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload.user;
                    state.isAuthenticated = true
                    localStorage.setItem("token", action.payload.token);
                })
                .addCase(otpofUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
            },


        })
        export const { logout } = authSlice.actions;
        export const { clearError } = authSlice.actions;
        export default authSlice.reducer;