import PropTypes from "prop-types";

const CommonPagination = ({ totalPages, currentPage, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 1) {
        pageNumbers.push(1);
        if (currentPage > 2) {
          pageNumbers.push("...");
        }
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-3 flex justify-between items-center space-x-2 p-2">
      <div>
        <label htmlFor="itemsPerPage" className="mr-2">Rows per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="px-2 py-1 border rounded focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="flex space-x-2">
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`px-2 py-1 text-sm rounded ${
              currentPage === page
                ? "bg-slate-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

CommonPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

export default CommonPagination;