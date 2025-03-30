import React from "react";
import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
  setCurrentPage,
  totalRows
}) {
  const pages = [];

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    pages.push(totalPages);
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="pagination">
      <ul>
        <li className={currentPage === 1 ? "disabled" : ""}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={currentPage === page ? "active" : ""}>
            <button
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={currentPage === totalPages ? "disabled" : ""}>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
      <div className="d-flex align-items-center gap-2">
       <small> ({totalRows})</small>

        <select
          className="page-size-selector"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

      </div>
    </div>
  );
}

export default Pagination;
