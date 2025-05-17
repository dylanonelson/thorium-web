import { ThBreakpoints, BreakpointsMap } from "@/packages/Hooks/useBreakpoints";

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
    [ThBreakpoints.compact]: defaultValue,
    [ThBreakpoints.medium]: defaultValue,
    [ThBreakpoints.expanded]: defaultValue,
    [ThBreakpoints.large]: defaultValue,
    [ThBreakpoints.xLarge]: defaultValue
  };

  if (typeof pref === "boolean" || pref instanceof Boolean) {
    if (!pref && disabledValue) {
      Object.values(ThBreakpoints).forEach((key) => {
        breakpointsMap[key] = disabledValue;
      });
    }
  } else if (typeof pref === "string" && isValidType(pref)) {
    Object.values(ThBreakpoints).forEach((key) => {
      breakpointsMap[key] = pref;
    });
  } else if (typeof pref === "object") {
    Object.entries(pref).forEach(([key, value]) => {
      if (value && isValidType(value.toString())) {
        breakpointsMap[key as ThBreakpoints] = value;
      }
    });
  }

  return breakpointsMap;
};