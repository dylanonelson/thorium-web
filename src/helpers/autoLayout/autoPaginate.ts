export interface PaginationDetails {
  breakpoint: number;
  width: number;
  lineLength: number;
}

export interface AutoPagination {
  colCount: number;
  colWidth: string;
}

export const autoPaginate = (details: PaginationDetails): AutoPagination => {
  const colCount = (details.width >= details.breakpoint && details.width >= details.lineLength) ? Math.floor(details.width / details.lineLength) : 1;
  return {
    colCount: colCount,
    colWidth: "auto" // remove once ReadiumCSS v2 is merged
  }
}