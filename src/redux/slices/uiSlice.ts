import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho state
interface UiState {
  searchQuery: string;
}

// State ban đầu
const initialState: UiState = {
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Action này sẽ được gọi khi người dùng gõ vào ô search
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

// Export action
export const { setSearchQuery } = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;