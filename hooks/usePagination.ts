import { useMemo } from "react";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  // Create an array of certain length and set the elements within it from
  // start value to end value.
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = (
  totalPages: number,
  currentPage: number,
  siblingCount: number
) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = totalPages;
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
  }, [totalPages, siblingCount, currentPage]);
  return paginationRange;
};

export default usePagination;
