import { getOptimalLineLength, LineLengthTypography } from "./optimalLineLength";

export interface PaginationDetails {
  breakpoint: number;
  width: number;
  typo: LineLengthTypography;
}

export interface AutoPagination {
  colCount: number;
  optimalLineLength: number;
  colWidth: string;
}

export const autoPaginate = (details: PaginationDetails): AutoPagination => {
  const optimalLineLength = getOptimalLineLength(details.typo);
  const colCount = (details.width >= details.breakpoint && details.width >= optimalLineLength) ? Math.floor(details.width / optimalLineLength) : 1;
  return {
    colCount: colCount,
    optimalLineLength: optimalLineLength,
    colWidth: "auto" // remove once ReadiumCSS v2 is merged
  }
}