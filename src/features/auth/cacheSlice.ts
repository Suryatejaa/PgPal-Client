import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface CacheState {
  [key: string]: CacheEntry;
}

const initialState: CacheState = {};

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCache: (state, action: PayloadAction<{ key: string; data: any }>) => {
      state[action.payload.key] = {
        data: action.payload.data,
        timestamp: Date.now(),
      };
    },
    invalidateCache: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearAllCache: () => {
      return initialState;
    },
  },
});

export const { setCache, invalidateCache, clearAllCache } = cacheSlice.actions;
export default cacheSlice.reducer;