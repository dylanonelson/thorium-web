import { defaultPlatformModifier, IPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { StaticBreakpoints } from "@/hooks/useBreakpoints";
import { createSlice } from "@reduxjs/toolkit";

interface IReaderState {
  isImmersive: boolean;
  isHovering: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
  settingsOpen: boolean;
  tocOpen: boolean;
  overflowMenuOpen: boolean;
  platformModifier: IPlatformModifier;
}

const initialState: IReaderState = {
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  hasReachedDynamicBreakpoint: false,
  staticBreakpoint: undefined,
  settingsOpen: false,
  tocOpen: false,
  overflowMenuOpen: false,
  platformModifier: defaultPlatformModifier
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
    setDynamicBreakpoint: (state, action) => {
      state.hasReachedDynamicBreakpoint = action.payload
    },
    setStaticBreakpoint: (state, action) => {
      state.staticBreakpoint = action.payload
    },
    setSettingsOpen: (state, action) => {
      state.settingsOpen = action.payload
    },
    setTocOpen: (state, action) => {
      state.tocOpen = action.payload
    },
    setOverflowMenuOpen: (state, action) => {
      state.overflowMenuOpen = action.payload
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
  setDynamicBreakpoint, 
  setStaticBreakpoint,
  setSettingsOpen, 
  setTocOpen, 
  setOverflowMenuOpen
} = readerSlice.actions;

export default readerSlice.reducer;