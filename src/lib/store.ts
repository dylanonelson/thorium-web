import { ThDockingKeys } from "@/preferences/models/enums";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import readerReducer from "@/lib/readerReducer";
import settingsReducer from "@/lib/settingsReducer";
import themeReducer from "@/lib/themeReducer";
import actionsReducer, { ActionsReducerState } from "@/lib/actionsReducer";
import publicationReducer from "./publicationReducer";

import debounce from "debounce";

const DEFAULT_STORAGE_KEY = "thorium-web-state";

const updateActionsState = (state: ActionsReducerState) => {
  const updatedKeys = Object.fromEntries(
    Object.entries(state.keys).map(([key, value]) => [
      key,
      {
        ...value,
        isOpen: value.docking === ThDockingKeys.transient || value.docking === null && value.isOpen === true ? false : value.isOpen,
      },
    ])
  );

  return {
    ...state,
    keys: updatedKeys,
    overflow: {}
  };
};

const loadState = (storageKey?: string) => {
  try {
    const resolvedKey = storageKey || DEFAULT_STORAGE_KEY;
    const serializedState = localStorage.getItem(resolvedKey);
    if (serializedState === null) {
      return { actions: undefined, settings: undefined, theming: undefined };
    }
    const deserializedState = JSON.parse(serializedState);
    deserializedState.actions = updateActionsState(deserializedState.actions);
    return deserializedState;
  } catch (err) {
    return { actions: undefined, settings: undefined, theming: undefined };
  }
};

const saveState = (state: object, storageKey?: string) => {
  try {
    const resolvedKey = storageKey || DEFAULT_STORAGE_KEY;
    const serializedState = JSON.stringify(state);
    localStorage.setItem(resolvedKey, serializedState);
  } catch (err) {
    console.error(err);
  }
};

export const makeStore = (storageKey?: string) => {
  const rootReducer = combineReducers({
    reader: readerReducer,
    settings: settingsReducer,
    theming: themeReducer,
    actions: actionsReducer,
    publication: publicationReducer
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      actions: loadState(storageKey).actions,
      settings: loadState(storageKey).settings,
      theming: loadState(storageKey).theming
    },
  });

  const saveStateDebounced = debounce(() => {
    saveState(store.getState(), storageKey);
  }, 500);

  store.subscribe(saveStateDebounced);

  return store;
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];