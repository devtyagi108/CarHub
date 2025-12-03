import { motion } from 'framer-motion';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
        whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
        whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
      >
        Previous
      </motion.button>
      {pages.map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {page}
        </motion.button>
      ))}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
        whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
        whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
      >
        Next
      </motion.button>
    </div>
  );
};

export default Pagination;

