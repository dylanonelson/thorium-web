/**
 * Creates a component map that works with any enum type and component structure
 * @param baseMap The base component map with default components
 * @param customMap Optional custom components to add or override
 * @returns A merged component map
 */
export function createComponentMap<T extends string | number | symbol, C extends object = any>(
  baseMap: Record<string | number | symbol, C>,
  customMap?: Partial<Record<T, C>>
): Record<string | number | symbol, C> {
  return {
    ...baseMap,
    ...customMap
  };
}