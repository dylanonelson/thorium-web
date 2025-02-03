import { createSlice } from "@reduxjs/toolkit";

import { IThemeState } from "@/models/state/themingState";
import { ColorScheme, ThemeKeys } from "@/models/theme";

const initialState: IThemeState = {
  colorScheme: ColorScheme.light,
  theme: ThemeKeys.auto,
  prefersReducedMotion: false,
  hasReachedDynamicBreakpoint: false,
  staticBreakpoint: undefined
}

export const themeSlice = createSlice({
  name: "theming",
  initialState,
  reducers: {
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setReducedMotion: (state, action) => {
      state.prefersReducedMotion = action.payload
    },
    setDynamicBreakpoint: (state, action) => {
      state.hasReachedDynamicBreakpoint = action.payload
    },
    setStaticBreakpoint: (state, action) => {
      state.staticBreakpoint = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setColorScheme, 
  setTheme, 
  setReducedMotion, 
  setDynamicBreakpoint, 
  setStaticBreakpoint,
} = themeSlice.actions;

export default themeSlice.reducer;