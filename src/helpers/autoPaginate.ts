export interface AutoPagination {
  colCount: number;
  colWidth: string;
}

export const autoPaginate = (breakpoint: number, width: number, lineLength: number): AutoPagination => {
  const colCount = (width >= breakpoint && width >= lineLength) ? Math.floor(width / lineLength) : 1;
  return {
    colCount: colCount,
    colWidth: "auto" // remove once ReadiumCSS v2 is merged
  }
}