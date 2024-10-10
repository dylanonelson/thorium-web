import { useState } from "react";

export interface IReaderState {
  isPaged?: boolean;
  settingsOpen?: boolean;
}

export const useReaderState = (initialState: IReaderState) => {
  const [readerState, setReaderState] = useState(initialState);

  const setProperty = (key: string, value: any) => {
    setReaderState((prevState: IReaderState) => ({...prevState, [key]: value}))
  }

  return [readerState, setProperty] as const;
}