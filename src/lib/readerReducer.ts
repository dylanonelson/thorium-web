import { createSlice } from "@reduxjs/toolkit";

import { IReaderState } from "@/models/state/readerState";
import { defaultPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { LayoutDirection } from "@/models/preferences";
import { ActionKeys } from "@/models/actions";

const initialState: IReaderState = {
  direction: LayoutDirection.ltr,
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  overflowMenuOpen: false,
  platformModifier: defaultPlatformModifier,
  leftDock: null,
  rightDock: null
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setDirection: (state, action) => {
      state.direction = action.payload
    },
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
    setOverflowMenuOpen: (state, action) => {
      state.overflowMenuOpen = action.payload
    },
    setLeftDock: (state, action) => {
      if (action.payload && Object.values(ActionKeys).includes(action.payload.actionKey)) {
        state.leftDock = action.payload
      } else {
        state.leftDock = null;
      }
    },
    setRightDock: (state, action) => {
      if (action.payload && Object.values(ActionKeys).includes(action.payload.actionKey)) {
        state.rightDock = action.payload
      } else {
        state.rightDock = null;
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setDirection, 
  setPlatformModifier, 
  setImmersive, 
  toggleImmersive, 
  setHovering, 
  setFullscreen, 
  setPaged, 
  setColCount, 
  setOverflowMenuOpen,
  setLeftDock, 
  setRightDock 
} = readerSlice.actions;

export default readerSlice.reducer;