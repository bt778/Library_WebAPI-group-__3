import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLoanPage = () => {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [borrowerId, setBorrowerId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [booksRes, borrowersRes] = await Promise.all([
          axios.get('https://localhost:7173/api/Books', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://localhost:7173/api/Borrowers', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setBooks(booksRes.data);
        setBorrowers(borrowersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load books or borrowers');
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      await axios.post('https://localhost:7173/api/Loans', {
        bookId,
        borrowerId,
        issueDate,
        dueDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/loans'); // Go back to Loans page
    } catch (err) {
      console.error('Error creating loan:', err);
      setError('Failed to create loan. Please check your input.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Loan</h1>
        <p className="subtitle">Issue a book to a borrower</p>
      </div>

      {error && <div className="error-message"><p>{error}</p></div>}

      <form className="loan-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book</label>
          <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
            <option value="">Select a book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Borrower</label>
          <select value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} required>
            <option value="">Select a borrower</option>
            {borrowers.map(borrower => (
              <option key={borrower.id} value={borrower.id}>
                {borrower.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Loan
        </button>
      </form>
    </div>
  );
};

export default CreateLoanPage;
