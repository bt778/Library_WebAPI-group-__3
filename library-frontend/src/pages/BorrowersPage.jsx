import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BorrowersPage = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New borrower form states
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://localhost:7173/api/Borrowers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setBorrowers(response.data);
      } catch (err) {
        console.error('Error fetching borrowers:', err);
        setError('Failed to load borrower records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, [navigate]);

  const handleCreateNewBorrower = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Borrower Management</h1>
        <p className="subtitle">Manage all library borrowers</p>
      </div>

      <div className="borrower-controls">
        <button 
          className="new-loan-btn" 
          onClick={handleCreateNewBorrower}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
        >
          + Add New Borrower
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFormError('');
            const token = localStorage.getItem('authToken');
            if (!token) {
              navigate('/login');
              return;
            }

            try {
              await axios.post('https://localhost:7173/api/Borrowers', {
                name: newName,
                email: newEmail,
                phone: newPhone,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              });

              // Refresh the borrower list
              const res = await axios.get('https://localhost:7173/api/Borrowers', {
                headers: { Authorization: `Bearer ${token}` }
              });
              setBorrowers(res.data);

              // Reset form and hide it
              setNewName('');
              setNewEmail('');
              setNewPhone('');
              setShowForm(false);
            } catch (err) {
              console.error('Failed to add borrower:', err);
              setFormError('Failed to add borrower. Please check your input.');
            }
          }}
          className="form"
          style={{ marginTop: '20px' }}
        >
          {formError && <div className="error-message">{formError}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">Save Borrower</button>
        </form>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading borrower records...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : borrowers.length === 0 ? (
        <div className="empty-state">
          <p>No borrowers found.</p>
          <button 
            className="new-loan-btn primary" 
            onClick={handleCreateNewBorrower}
            style={{ cursor: 'pointer' }}
          >
            + Add New Borrower
          </button>
        </div>
      ) : (
        <div className="loans-list">
          {borrowers.map(borrower => (
            <div key={borrower.id} className="loan-card">
              <div className="loan-id">Borrower ID: {borrower.id}</div>
              <div className="loan-book">
                <div className="book-cover"></div>
                <div>
                  <h3>{borrower.name || 'Unnamed Borrower'}</h3>
                  <p>Email: {borrower.email || 'N/A'}</p>
                  <p>Phone: {borrower.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="loan-actions">
                <button className="details-btn">View Details</button>
                {/* Optional: Edit or Delete buttons */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowersPage;
