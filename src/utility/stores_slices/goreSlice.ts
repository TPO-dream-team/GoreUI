import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utility/axios';
import type { RootState } from '../store';

export interface Gora {
    id: string;
    name: string;
    height: number;
    regionId: number;
    lat: number;
    lon: number
}

interface GoreState {
    loading: boolean;
    error: string | null;
    gore: Gora[] | null;
}

const initialState: GoreState = {
    loading: false,
    error: null,
    gore: null,
};

export const fetchGore = createAsyncThunk(
  'mountain/get',
  async (force: boolean = false, { rejectWithValue }) => {
    try {
      const response = await api.get('/mountain');
      return { data: response.data };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Connection Timeout');
    }
  },
  {
    condition: (force, { getState }) => {
      if (force) return true;
      
      const { mountain } = getState() as RootState;
      if (mountain.loading) return false;
      
      const hasData = Array.isArray(mountain.gore) && mountain.gore.length > 0;
      return !hasData;
    },
  }
);

const goreSlice = createSlice({
    name: 'mountain',
    initialState,
    reducers: {
        clearGoreData: (state) => {
            state.loading = false;
            state.gore = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGore.fulfilled, (state, action) => {
                state.loading = false;
                state.gore = action.payload.data;
            })
            .addCase(fetchGore.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Something went wrong";
            });
    },
});

export const { clearGoreData } = goreSlice.actions;
export default goreSlice.reducer;

