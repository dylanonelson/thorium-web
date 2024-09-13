export interface AutoPagination {
  colCount: number;
  colWidth: number | string;
}

export const autoPaginate = (width: number, lineLength: number): AutoPagination => {
  const colCount = width >= lineLength ? Math.floor(width / lineLength) : 1;
  return {
    colCount: colCount,
    colWidth: colCount === 1 ? 100 : "auto"
  }
}