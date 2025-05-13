import { Breakpoints, BreakpointsMap } from "@/packages/Hooks/useBreakpoints";

export const makeBreakpointsMap = <T>({
  defaultValue,
  fromEnum,
  pref,
  disabledValue,
}: {
  defaultValue: T;
  fromEnum: any;
  pref?: BreakpointsMap<T> | boolean;
  disabledValue?: T;
}): Required<BreakpointsMap<T>> => {
  
  const isValidType = (t: string) => {
    return Object.values(fromEnum).includes(t);
  };

  const breakpointsMap: Required<BreakpointsMap<T>> = {
    [Breakpoints.compact]: defaultValue,
    [Breakpoints.medium]: defaultValue,
    [Breakpoints.expanded]: defaultValue,
    [Breakpoints.large]: defaultValue,
    [Breakpoints.xLarge]: defaultValue
  };

  if (typeof pref === "boolean" || pref instanceof Boolean) {
    if (!pref && disabledValue) {
      Object.values(Breakpoints).forEach((key) => {
        breakpointsMap[key] = disabledValue;
      });
    }
  } else if (typeof pref === "string" && isValidType(pref)) {
    Object.values(Breakpoints).forEach((key) => {
      breakpointsMap[key] = pref;
    });
  } else if (typeof pref === "object") {
    Object.entries(pref).forEach(([key, value]) => {
      if (value && isValidType(value.toString())) {
        breakpointsMap[key as Breakpoints] = value;
      }
    });
  }

  return breakpointsMap;
};