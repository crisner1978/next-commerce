import { useRouter } from "next/router";
import React, { useState } from "react";
import usePagination from "../hooks/usePagination";

interface Props {
  totalPages: number;
  siblingCount: number;
}

const ProductPagination = ({ totalPages, siblingCount }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const paginationRange = usePagination(totalPages, currentPage, siblingCount);
  const lastPage = paginationRange?.[paginationRange?.length - 1];

  if (currentPage === 0 || paginationRange?.length! < 2) return null;

  const isDisabled = (pageNumber: number) =>
    Number(router.query.page) === lastPage && pageNumber === lastPage;
  const isActivePage = (pageNumber: number) =>
    Number(router?.query.page) === pageNumber;

  function onPageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
    router.push(`/?page=${pageNumber}`);
  }

  return (
    <div className="container flex justify-center space-x-5 mb-12">
      {paginationRange?.map((pageNumber) => (
        <button
          disabled={isDisabled(pageNumber)}
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`${
            isActivePage(pageNumber)
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-50 text-gray-500 hover:bg-white"
          } paginationBtn`}>
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default ProductPagination;
