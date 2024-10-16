import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IReaderState {
  isImmersive?: boolean;
  isHovering?: boolean;
  isFullscreen?: boolean;
  isFXL?: boolean;
  isPaged?: boolean;
  isRTL?: boolean;
  hasReachedBreakpoint?: boolean;
  isPublicationStart?: boolean;
  isPublicationEnd?: boolean;
  settingsOpen?: boolean;
}

const initialState: IReaderState = {
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isFXL: false,
  isPaged: true,
  isRTL: false,
  hasReachedBreakpoint: false,
  isPublicationStart: false,
  isPublicationEnd: false,
  settingsOpen: false
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setImmersive: (state, action) => {
      state.isImmersive = action.payload
    },
    setHovering: (state, action) => {
      state.isHovering = action.payload
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
    setFXL: (state, action) => {
      state.isFXL = action.payload
    },
    setPaged: (state, action) => {
      state.isPaged = action.payload
    },
    setRTL: (state, action) => {
      state.isRTL = action.payload
    },
    setBreakpoint: (state, action) => {
      state.hasReachedBreakpoint = action.payload
    },
    setPublicationStart: (state, action) => {
      state.isPublicationStart = action.payload
    },
    setPublicationEnd: (state, action) => {
      state.isPublicationEnd = action.payload
    },
    setSettingsOpen: (state, action: PayloadAction<any>) => {
      state.settingsOpen = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setImmersive, 
  setHovering, 
  setFullscreen, 
  setFXL, 
  setPaged, 
  setRTL, 
  setBreakpoint, 
  setPublicationStart, 
  setPublicationEnd, 
  setSettingsOpen 
} = readerSlice.actions;

export default readerSlice.reducer;