import { createContext } from "react";

export interface IReaderState {
  isPaged?: boolean;
  settingsOpen?: boolean;
  updateState: (newState: Partial<IReaderState>) => void;
}

const defaultState: IReaderState = {
  // isPaged: true,
  // settingsOpen: false,
  updateState: (newState?: Partial<IReaderState>) => {}
};

export const ReaderState = createContext<IReaderState>(defaultState);