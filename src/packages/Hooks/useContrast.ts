import { useEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export enum Contrast {
  none = "no-preference",
  more = "more",
  less = "less",
  custom = "custom"
}

export const useContrast = (onChange?: (contrast: Contrast) => void) => {
  const [contrast, setContrast] = useState(Contrast.none);

  const prefersNoContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.none })`);
  const prefersLessContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.less })`);
  const prefersMoreContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.more })`);
  const prefersCustomContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.custom })`);

  useEffect(() => {
    let newContrast: Contrast = Contrast.none;
    if (prefersNoContrast) {
      newContrast = Contrast.none;
    } else if (prefersLessContrast) {
      newContrast = Contrast.less;
    } else if (prefersMoreContrast) {
      newContrast = Contrast.more;
    } else if (prefersCustomContrast) {
      newContrast = Contrast.custom;
    }
    setContrast(newContrast);
    onChange && onChange(newContrast);
  }, [onChange, prefersNoContrast, prefersLessContrast, prefersMoreContrast, prefersCustomContrast]);

  return contrast;
}