import React from 'react';

interface LeaderboardPaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const LeaderboardPagination: React.FC<LeaderboardPaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startRange = (currentPage - 1) * itemsPerPage + 1;
    const endRange = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing <strong>{startRange}</strong> - <strong>{endRange}</strong> of <strong>{totalItems}</strong> entries
            </div>

            <div className="pagination-controls">
                <button
                    className="page-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`page-num ${page === currentPage ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="page-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <style jsx>{`
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-top: 1rem;
          border-top: 1px solid #e9ecef;
        }
        .pagination-info {
          font-size: 0.9rem;
          color: #4b5563;
        }
        .pagination-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .page-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          color: #374151;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-numbers {
          display: flex;
          gap: 0.25rem;
        }
        .page-num {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .page-num.active {
          background: #667eea;
          color: white;
          font-weight: 600;
        }
        .page-num:hover:not(.active) {
          background: #e5e7eb;
        }
      `}</style>
        </div>
    );
};

export default LeaderboardPagination;
