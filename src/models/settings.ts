import { PressEvent } from "react-aria-components";
import { SettingsRangeVariant, SheetHeaderVariant, SpacingSettingsKeys, TextSettingsKeys } from "@/preferences/models/enums";

export interface ISettingsGroupPref {
  main?: TextSettingsKeys[];
  subPanel?: TextSettingsKeys[] | null;
  header?: SheetHeaderVariant;
}

export interface ISettingsRangePref {
  variant?: SettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export interface ISettingsMapObject {
  Comp: React.FC<IAdvancedDisplayProps> | React.ComponentType<any>;
  props?: any;
}

export interface IReadingDisplayGroupWrapperProps {
  heading: string;
  moreLabel: string;
  moreTooltip: string;
  onMorePressCallback: (e: PressEvent) => void;
  settingsMap: { [key in SpacingSettingsKeys]: ISettingsMapObject } | { [key in TextSettingsKeys]: ISettingsMapObject };
  prefs?: ISettingsGroupPref;
  defaultPrefs: {
    main: TextSettingsKeys[] | SpacingSettingsKeys[];
    subPanel: TextSettingsKeys[] | SpacingSettingsKeys[];
  };
}

export interface IAdvancedDisplayProps {
  standalone?: boolean;
}