// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import BorrowersPage from './pages/BorrowersPage';
import LoansPage from './pages/LoansPage';
import CreateLoanPage from './pages/CreateLoanPage'; // Import the CreateLoanPage component

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="header-content">
          <h1 className="logo">Library</h1>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/books">Books</Link>
              </li>
              <li>
                <Link to="/borrowers">Borrowers</Link>
              </li>
              <li>
                <Link to="/loans">Loans</Link>
              </li>
            </ul>
          </nav>
          <div className="auth-actions">
            <Link to="/login" className="login-btn"> Login</Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrowers" element={<BorrowersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-loan" element={<CreateLoanPage />} /> {/* ADD THIS ROUTE */}
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Library</h3>
            <p>Your complete library management solution</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/books">Browse Books</Link></li>
              <li><Link to="/loans">Loan Status</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Debre Berhan  Ethiopia</p>
            <p>library.com</p>
            <p>(+251)930244831</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Library. All rights reserved.</p>
        </div>
      </footer>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div id="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Library</h1>
          <p className="subtitle">Manage your library collection with ease</p>

        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Book Management</h3>
          <p>Easily catalog and organize your entire collection.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Borrower Tracking</h3>
          <p>Manage members and track borrowing history.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Loan Control</h3>
          <p>Monitor due dates and manage renewals.</p>
        </div>
      </section>
    </div>
  );
}

export default App;