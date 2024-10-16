import { configureStore } from "@reduxjs/toolkit";
import readerReducer from "@/lib/readerReducer";
import publicationReducer from "./publicationReducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      reader: readerReducer,
      publication: publicationReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];