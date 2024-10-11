import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IReaderState {
  isPaged?: boolean;
  settingsOpen?: boolean;
}

const initialState: IReaderState = {
  isPaged: true,
  settingsOpen: false
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setPaged: (state, action) => {
      return { ...state, isPaged: action.payload }
    },
    setSettingsOpen: (state, action: PayloadAction<any>) => {
      return { ...state, settingsOpen: action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setPaged, setSettingsOpen } = readerSlice.actions;

export default readerSlice.reducer;