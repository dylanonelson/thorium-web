"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

export function StoreProvider({
  storageKey,
  children
}: {
  storageKey?: string,
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(storageKey)
  }

  return <Provider store={ storeRef.current }>{ children }</Provider>
}

export default StoreProvider;