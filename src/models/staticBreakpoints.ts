import { SheetTypes } from "./sheets";
import { DockTypes } from "./docking";

export enum StaticBreakpoints {
  compact = "compact",
  medium = "medium",
  expanded = "expanded",
  large = "large",
  xLarge = "xLarge"
}

export type Breakpoints = { [key in StaticBreakpoints]: boolean | null } & { current: string | undefined } & { ranges: BreakpointRanges };

export type BreakpointRange = {
  min: number | null,
  max: number | null
}

export type BreakpointRanges = { [key in StaticBreakpoints]: BreakpointRange | null; }

export type BreakpointsMap = { [key in StaticBreakpoints]: SheetTypes | DockTypes }