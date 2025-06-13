import { createSlice } from "@reduxjs/toolkit";

import { defaultPlatformModifier, UnstablePlatformModifier } from "@/core/Helpers/keyboardUtilities";
import { ThSettingsContainerKeys, ThLayoutDirection } from "@/preferences/models/enums";

export interface ReaderReducerState {
  direction: ThLayoutDirection;
  isLoading: boolean;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: ThSettingsContainerKeys;
  platformModifier: UnstablePlatformModifier;
}

const initialState: ReaderReducerState = {
  direction: ThLayoutDirection.ltr,
  isLoading: true,
  isImmersive: false,
  isHovering: false,
  hasArrows: true,
  isFullscreen: false,
  settingsContainer: ThSettingsContainerKeys.initial,
  platformModifier: defaultPlatformModifier
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setDirection: (state, action) => {
      state.direction = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setPlatformModifier: (state, action) => {
      state.platformModifier = action.payload
    },
    setImmersive: (state, action) => {
      state.isImmersive = action.payload
      if (action.payload === true) {
        state.isHovering = false;
      }
    },
    toggleImmersive: (state) => {
      state.isImmersive = !state.isImmersive;
      if (state.isImmersive === true) {
        state.isHovering = false;
      }
    },
    setHovering: (state, action) => {
      state.isHovering = action.payload
    },
    setArrows: (state, action) => {
      state.hasArrows = action.payload
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
    setSettingsContainer: (state, action) => {
      state.settingsContainer = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setDirection, 
  setLoading,
  setPlatformModifier, 
  setImmersive, 
  toggleImmersive, 
  setHovering, 
  setArrows, 
  setFullscreen, 
  setSettingsContainer
} = readerSlice.actions;

export default readerSlice.reducer;