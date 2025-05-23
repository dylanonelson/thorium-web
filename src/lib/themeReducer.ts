import { createSlice } from "@reduxjs/toolkit";

import { ThColorScheme } from "@/core/Hooks/useColorScheme";
import { ThContrast } from "@/core/Hooks/useContrast";
import { ThBreakpoints } from "@/core/Hooks/useBreakpoints";

export interface ThemeReducerState {
  monochrome: boolean;
  colorScheme: ThColorScheme;
  theme: string;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersContrast: ThContrast;
  forcedColors: boolean;
  breakpoint?: ThBreakpoints;
}

const initialState: ThemeReducerState = {
  monochrome: false,
  colorScheme: ThColorScheme.light,
  theme: "auto",
  prefersReducedMotion: false,
  prefersReducedTransparency: false, 
  prefersContrast: ThContrast.none,
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