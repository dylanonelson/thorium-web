"use client";

import { createContext } from 'react';
import { RSPrefs } from './preferences';

import { IRSPrefs } from '@/models/preferences';

const PreferencesContext = createContext(RSPrefs);

export default function ThPreferencesProvider({ value, children }: {
  value?: IRSPrefs,
  children: React.ReactNode
}) {
  return (
    <PreferencesContext.Provider value={ value || RSPrefs }>
      { children }
    </PreferencesContext.Provider>
  );
};

export { ThPreferencesProvider, PreferencesContext };