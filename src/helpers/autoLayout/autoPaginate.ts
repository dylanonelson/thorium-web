export const autoPaginate = (breakpoint: number, width: number, lineLength: number): number => {
  return (width >= breakpoint && width >= lineLength) ? Math.floor(width / lineLength) : 1;
}