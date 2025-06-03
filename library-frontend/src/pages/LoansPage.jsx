import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [returningLoanId, setReturningLoanId] = useState(null); // for disabling button during return
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fix: use lowercase 'loans' to match backend route exactly
        const response = await axios.get('https://localhost:7173/api/loans', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setLoans(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load loan records. Please try again.');
        }
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [navigate]);

  const filteredLoans = loans.filter(loan => {
    if (filter === 'all') return true;
    if (filter === 'active') return !loan.returnDate;
    if (filter === 'returned') return loan.returnDate;
    return true;
  });

  const handleReturnBook = async (loanId) => {
    try {
      const token = localStorage.getItem('authToken');
      setReturningLoanId(loanId); // disable button during API call

      // Fix: POST to /api/returns with loanId in body
      await axios.post('https://localhost:7173/api/returns', { id: loanId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLoans(loans.map(loan =>
        loan.id === loanId ? { ...loan, returnDate: new Date().toISOString() } : loan
      ));
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to mark book as returned');
    } finally {
      setReturningLoanId(null);
    }
  };

  const handleCreateNewLoan = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/new-loan');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Loan Management</h1>
        <p className="subtitle">Track all book loans and returns</p>
      </div>

      <div className="loan-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Loans
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Loans
        </button>
        <button
          className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
          onClick={() => setFilter('returned')}
        >
          Returned
        </button>
        <button
          className="new-loan-btn"
          onClick={handleCreateNewLoan}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
        >
          + Create New Loan
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading loan records...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="empty-state">
          <p>No {filter === 'all' ? '' : filter} loans found.</p>
          <button
            className="new-loan-btn primary"
            onClick={handleCreateNewLoan}
            style={{ cursor: 'pointer' }}
          >
            + Create New Loan
          </button>
        </div>
      ) : (
        <div className="loans-list">
          {filteredLoans.map(loan => (
            <div key={loan.id} className="loan-card">
              <div className="loan-id">Loan ID: {loan.id}</div>
              <div className="loan-book">
                <div className="book-cover"></div>
                <div>
                  <h3>{loan.book?.title || 'Unknown Book'}</h3>
                  <p>by {loan.book?.author || 'Unknown Author'}</p>
                  <p className="book-id">Book ID: {loan.bookId}</p>
                </div>
              </div>
              <div className="loan-details">
                <div>
                  <p className="detail-label">Borrower</p>
                  <p>{loan.borrower?.name || 'Unknown Borrower'}</p>
                  <p className="borrower-id">Borrower ID: {loan.borrowerId}</p>
                </div>
                <div>
                  <p className="detail-label">Issued On</p>
                  <p>{new Date(loan.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="detail-label">Due Date</p>
                  <p>{new Date(loan.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="detail-label">Status</p>
                  <p className={`loan-status ${loan.returnDate ? 'returned' : 'active'}`}>
                    {loan.returnDate
                      ? `Returned on ${new Date(loan.returnDate).toLocaleDateString()}`
                      : 'Active'}
                  </p>
                </div>
              </div>
              <div className="loan-actions">
                {!loan.returnDate && (
                  <button
                    className="return-btn"
                    onClick={() => handleReturnBook(loan.id)}
                    disabled={returningLoanId === loan.id}
                  >
                    {returningLoanId === loan.id ? 'Returning...' : 'Mark as Returned'}
                  </button>
                )}
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoansPage;
