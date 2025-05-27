"use client";

import { useContext } from "react";
import { ThPreferencesContext } from "../ThPreferencesContext";

export const usePreferences = () => useContext(ThPreferencesContext);