import { useBreakpoints } from "./useBreakpoints"
import { useColorScheme } from "./useColorScheme";

export const useTheming = () => {
  const breakpoints = useBreakpoints();
  const colorScheme = useColorScheme();

  return {
    breakpoints,
    colorScheme
  }
}