import { defaultModifier, IPlatformModifier } from "@/helpers/buildPlatformModifier";
import { createSlice } from "@reduxjs/toolkit";

interface IReaderState {
  isImmersive: boolean;
  isHovering: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  hasReachedBreakpoint: boolean;
  settingsOpen: boolean;
  tocOpen: boolean;
  platformModifier: IPlatformModifier;
}

const initialState: IReaderState = {
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  hasReachedBreakpoint: false,
  settingsOpen: false,
  tocOpen: false,
  platformModifier: defaultModifier
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setPlatformModifier: (state, action) => {
      state.platformModifier = action.payload
    },
    setImmersive: (state, action) => {
      state.isImmersive = action.payload
    },
    toggleImmersive: (state) => {
      state.isImmersive = !state.isImmersive;
    },
    setHovering: (state, action) => {
      state.isHovering = action.payload
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
    setPaged: (state, action) => {
      state.isPaged = action.payload
    },
    setColCount: (state, action) => {
      state.colCount = action.payload
    },
    setBreakpoint: (state, action) => {
      state.hasReachedBreakpoint = action.payload
    },
    setSettingsOpen: (state, action) => {
      state.settingsOpen = action.payload
    },
    setTocOpen: (state, action) => {
      state.settingsOpen = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setPlatformModifier, 
  setImmersive, 
  toggleImmersive, 
  setHovering, 
  setFullscreen, 
  setPaged, 
  setColCount, 
  setBreakpoint, 
  setSettingsOpen, 
  setTocOpen
} = readerSlice.actions;

export default readerSlice.reducer;