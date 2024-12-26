import { ActionKeys } from "@/components/Templates/ActionComponent";
import { defaultPlatformModifier, IPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { createSlice } from "@reduxjs/toolkit";

interface IReaderState {
  isImmersive: boolean;
  isHovering: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  settingsOpen: boolean;
  tocOpen: boolean;
  overflowMenuOpen: boolean;
  platformModifier: IPlatformModifier;
  leftDock: ActionKeys | null;
  rightDock: ActionKeys | null;
}

const initialState: IReaderState = {
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  settingsOpen: false,
  tocOpen: false,
  overflowMenuOpen: false,
  platformModifier: defaultPlatformModifier,
  leftDock: null,
  rightDock: null
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
    setSettingsOpen: (state, action) => {
      state.settingsOpen = action.payload
    },
    setTocOpen: (state, action) => {
      state.tocOpen = action.payload
    },
    setOverflowMenuOpen: (state, action) => {
      state.overflowMenuOpen = action.payload
    },
    setLeftDock: (state, action) => {
      if (Object.values(ActionKeys).includes(action.payload)) {
        state.leftDock = action.payload
      } else {
        state.leftDock = null;
      }
    },
    setRightDock: (state, action) => {
      if (Object.values(ActionKeys).includes(action.payload)) {
        state.rightDock = action.payload
      } else {
        state.rightDock = null;
      }
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
  setSettingsOpen, 
  setTocOpen, 
  setOverflowMenuOpen,
  setLeftDock, 
  setRightDock 
} = readerSlice.actions;

export default readerSlice.reducer;