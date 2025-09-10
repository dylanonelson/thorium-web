import { ThPreferences, CustomizableKeys } from "../preferences";

export interface PreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> {
  getPreferences(): ThPreferences<T>;
  setPreferences(prefs: ThPreferences<T>): void;
  subscribe(callback: (prefs: ThPreferences<T>) => void): void;
  unsubscribe(callback: (prefs: ThPreferences<T>) => void): void;
}
