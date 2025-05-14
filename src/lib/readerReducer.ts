import { createSlice } from "@reduxjs/toolkit";

import { defaultPlatformModifier, IPlatformModifier } from "@/packages/Helpers/keyboardUtilities";
import { ThLayoutDirection } from "@/preferences/models/enums";
import { SettingsContainerKeys } from "@/models/settings";

export interface ReaderReducerState {
  direction: ThLayoutDirection;
  isLoading: boolean;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: SettingsContainerKeys;
  platformModifier: IPlatformModifier;
}

const initialState: ReaderReducerState = {
  direction: ThLayoutDirection.ltr,
  isLoading: true,
  isImmersive: false,
  isHovering: false,
  hasArrows: true,
  isFullscreen: false,
  settingsContainer: SettingsContainerKeys.initial,
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
    },
    toggleImmersive: (state) => {
      state.isImmersive = !state.isImmersive;
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