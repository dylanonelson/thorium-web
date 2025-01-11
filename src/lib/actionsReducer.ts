import { createSlice } from "@reduxjs/toolkit";

import { ActionKeys } from "@/models/actions";
import { IActionsState } from "@/models/state/actionsState";
import { DockingKeys } from "@/models/docking";

const initialState: IActionsState = {
  [ActionKeys.toc]: {
    isOpen: false,
    isDocked: DockingKeys.transient
  },
  [ActionKeys.settings]: {
    isOpen: false,
    isDocked: DockingKeys.transient
  },
  [ActionKeys.jumpToPosition]: {
    isOpen: false,
    isDocked: DockingKeys.transient
  }
}

export const actionsSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {
    setJumpToPositionAction: (state, action) => {
      Object.assign(state.jumpToPosition, action.payload)
    },
    setSettingsAction: (state, action) => {
      Object.assign(state.settings, action.payload)
    },
    setTocAction: (state, action) => {
      Object.assign(state.toc, action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setJumpToPositionAction, 
  setSettingsAction, 
  setTocAction,
} = actionsSlice.actions;

export default actionsSlice.reducer;