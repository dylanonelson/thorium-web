import { createSlice } from "@reduxjs/toolkit";

import { IReaderState } from "@/models/state/readerState";
import { defaultPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { LayoutDirection } from "@/models/layout";

const initialState: IReaderState = {
  direction: LayoutDirection.ltr,
  isImmersive: false,
  isHovering: false,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  platformModifier: defaultPlatformModifier
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
  setColCount
} = readerSlice.actions;

export default readerSlice.reducer;