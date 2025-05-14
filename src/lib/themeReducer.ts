import { createSlice } from "@reduxjs/toolkit";

import { ThemeKeys } from "@/models/theme";
import { ColorScheme } from "@/packages/Hooks/useColorScheme";
import { Contrast } from "@/packages/Hooks/useContrast";
import { Breakpoints } from "@/packages/Hooks/useBreakpoints";

export interface ThemeReducerStates {
  monochrome: boolean;
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersContrast: Contrast;
  forcedColors: boolean;
  breakpoint?: Breakpoints;
}

const initialState: ThemeReducerStates = {
  monochrome: false,
  colorScheme: ColorScheme.light,
  theme: ThemeKeys.auto,
  prefersReducedMotion: false,
  prefersReducedTransparency: false, 
  prefersContrast: Contrast.none,
  forcedColors: false, 
  breakpoint: undefined
}

export const themeSlice = createSlice({
  name: "theming",
  initialState,
  reducers: {
    setMonochrome: (state, action) => {
      state.monochrome = action.payload
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setReducedMotion: (state, action) => {
      state.prefersReducedMotion = action.payload
    },
    setReducedTransparency: (state, action) => {
      state.prefersReducedTransparency = action.payload
    },
    setContrast: (state, action) => {
      state.prefersContrast = action.payload
    },
    setForcedColors: (state, action) => {
      state.forcedColors = action.payload
    },
    setBreakpoint: (state, action) => {
      state.breakpoint = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setMonochrome, 
  setColorScheme, 
  setTheme, 
  setReducedMotion, 
  setReducedTransparency, 
  setContrast, 
  setForcedColors, 
  setBreakpoint,
} = themeSlice.actions;

export default themeSlice.reducer;