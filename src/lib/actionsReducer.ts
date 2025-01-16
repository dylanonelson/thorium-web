import { createSlice } from "@reduxjs/toolkit";

import { ActionKeys } from "@/models/actions";
import { IActionsState, IActionStateDockPayload, IActionStateOpenPayload, IActionStateSlotPayload } from "@/models/state/actionsState";
import { DockingKeys } from "@/models/docking";

const initialState: IActionsState = {
  dock: {
    [DockingKeys.start]: {
      actionKey: null,
      active: false,
      open: false
    },
    [DockingKeys.end]: {
      actionKey: null,
      active: false,
      open: false
    }
  },
  keys: {
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
}

export const actionsSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {
    dockAction: (state, action: IActionStateDockPayload) => {
      switch (action.payload.key) {
        case ActionKeys.jumpToPosition:
        case ActionKeys.toc:
        case ActionKeys.settings:
          // The user should be able to override the dock slot
          // so we override the previous value, and only check
          // whether we need to switch slots for the action
          // by removing the action from another slot first
          switch(action.payload.dockingKey) {
            // The action should be removed from either slot
            case DockingKeys.transient:
              if (state.dock[DockingKeys.start].actionKey === action.payload.key) {
                state.dock[DockingKeys.start] = initialState.dock[DockingKeys.start];
              }
              if (state.dock[DockingKeys.end].actionKey === action.payload.key) {
                state.dock[DockingKeys.end] = initialState.dock[DockingKeys.end];
              }
              break;
            // The action should be put in start slot, and removed from end
            case DockingKeys.start:
              // Remove from end
              if (state.dock[DockingKeys.end].actionKey === action.payload.key) {
                state.dock[DockingKeys.end] = initialState.dock[DockingKeys.end];
              }
              // If there was already an action docked in start slot, we should close it
              if (
                  state.dock[DockingKeys.start].actionKey && 
                  state.dock[DockingKeys.start].open
                ) {
                  const key = state.dock[DockingKeys.start].actionKey;
                  state.keys[key] = { 
                    ...state.keys[key], 
                    isOpen: false 
                  };
              }
              // Put in start
              state.dock[DockingKeys.start] = { 
                actionKey: action.payload.key,
                active: true,
                open: true
              };
              break;
            // The action should be put in end slot, and removed from start
            case DockingKeys.end:
              // Remove from start
              if (state.dock[DockingKeys.start].actionKey === action.payload.key) {
                state.dock[DockingKeys.start] = initialState.dock[DockingKeys.start];
              }
              // If there was already an action docked in end slot, we should close it
              if (
                state.dock[DockingKeys.end].actionKey && 
                state.dock[DockingKeys.end].open
              ) {
                const key = state.dock[DockingKeys.end].actionKey;
                state.keys[key] = { 
                  ...state.keys[key], 
                  isOpen: false 
                };
              }
              // Put in end
              state.dock[DockingKeys.end] = { 
                actionKey: action.payload.key,
                active: true,
                open: true
              };
            default: 
              break;
          }
          break; 
        default:
          break;
      }
      state.keys[action.payload.key] = { 
        ...state.keys[action.payload.key],
         isDocked: action.payload.dockingKey 
      };
    },
    setAction: (state, action: IActionStateOpenPayload) => {
      switch (action.payload.key) {
        case ActionKeys.jumpToPosition:
        case ActionKeys.toc:
        case ActionKeys.settings:
          // If open changes we need to sync the dock
          if (state.dock[DockingKeys.start].actionKey === action.payload.key) {
            state.dock[DockingKeys.start] = { 
              ...state.dock[DockingKeys.start], 
              open: action.payload.isOpen 
            };
          }
          if (state.dock[DockingKeys.end].actionKey === action.payload.key) {
            state.dock[DockingKeys.end] = { 
              ...state.dock[DockingKeys.end], 
              open: action.payload.isOpen 
            };
          }
          state.keys[action.payload.key] = {
            ...state.keys[action.payload.key],
            isOpen: action.payload.isOpen 
          };
          break;
        default:
          break;
      }
    },
    activateDockPanel: (state, action: IActionStateSlotPayload) => {
      // TMP before dockedStart + dockedEnd
      // When mounting the panel, we want it active so that
      // it can react to the docking.dock preference based on breakpoints
      // without having to treat it as a side effect
      state.dock[action.payload] = {
        ...state.dock[action.payload],
        active: true
      }
    },
    deactivateDockPanel: (state, action: IActionStateSlotPayload) => {
      // TMP before dockedStart + dockedEnd
      // When unmounting the panel, we want it active so that
      // it can react to the docking.dock preference based on breakpoints 
      // without having to treat it as a side effect
      state.dock[action.payload] = {
        ...state.dock[action.payload],
        active: false
      }
    },
    collapseDockPanel: (state, action: IActionStateSlotPayload) => {
      // When collapsing the panel we need to close both the key and dock slot
      const key = state.dock[action.payload].actionKey;
      if (key) {
        state.keys[key] = { 
          ...state.keys[key], 
          isOpen: false 
        };
      }
      state.dock[action.payload] = {
        ...state.dock[action.payload],
        open: false
      }
    },
    expandDockPanel: (state, action: IActionStateSlotPayload) => {
       // When expanding the panel we need to open both the key and dock slot
      const key = state.dock[action.payload].actionKey;
      if (key) {
        state.keys[key] = { 
          ...state.keys[key], 
          isOpen: true 
        };
      }
      state.dock[action.payload] = {
        ...state.dock[action.payload],
        open: true
      }
    }
  }
})

export const { 
  dockAction, 
  setAction, 
  activateDockPanel, 
  deactivateDockPanel, 
  collapseDockPanel, 
  expandDockPanel
} = actionsSlice.actions;

export default actionsSlice.reducer;