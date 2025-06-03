import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://localhost:7173/api/Books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBooks(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Could not fetch books. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Books</h1>
      </div>

      {loading ? (
        <div>Loading books...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : books.length === 0 ? (
        <div>No books found.</div>
      ) : (
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Total Copies</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.totalCopies}</td>
                <td>{book.copiesAvailable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BooksPage;