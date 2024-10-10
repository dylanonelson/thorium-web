"use client"

import { ReactNode, useState } from "react";
import { IReaderState, ReaderState } from "./readerState";

export const ReaderStateProvider = ({children}: {children: ReactNode}) => {
  const [state, setState] = useState({});

  const updateState = (newState: Partial<IReaderState>) => {
    setState({...state, ...newState});
  }

  return (
    <ReaderState.Provider value={{...state, updateState}}>{children}</ReaderState.Provider>
  )
}