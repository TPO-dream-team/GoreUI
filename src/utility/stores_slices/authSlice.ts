// src/stores/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import api from '@/utility/axios';

interface decodedDataType {
  token: string;
  id: string;
  username: string;
  role: string;
  token_expire: number // Miliseconds. Same as JS date
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { Username: string; Password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/login', credentials);
      const decodedData : any = jwtDecode(response.data.token); 
      console.log(decodedData)
      const responseData : decodedDataType = {
        token : response.data.token,
        id: decodedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        username : decodedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role : decodedData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        token_expire:  decodedData.exp * 1000
      }
      return responseData; 
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';

        return rejectWithValue({
        success: false,
        message: errorMessage,
        })
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/register',
  async (credentials: { Username: string; Password: string, RepeatPassword: string}, { rejectWithValue }) => {
    try {
      console.log(credentials)
      const response = await api.post('/user/register', credentials);
      return {
        success: true,
        message: response.data?.message || 'Registration successful!',
      };
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';

        return rejectWithValue({
        success: false,
        message: errorMessage,
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null as string | null,
    username: null as string | null, // null until you login, also will be saved
    role: null as string | null, 
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        //state.loading = true;      
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        //state.loading = false;
        state.token = action.payload.token; // Save the JWT
        state.username = action.payload.username;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, _) => {
        //state.loading = false;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;



