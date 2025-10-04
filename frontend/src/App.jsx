// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Container } from 'react-bootstrap';

// Import Components and Pages
import NavbarComponent from './components/Navbar';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookFormPage from './pages/BookFormPage';

// Private Route Component
const PrivateRoute = ({ children }) => {
    const { user } = React.useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <div data-bs-theme="dark">
                <NavbarComponent />
                <Container className="py-4">
                    <Routes>
                        <Route path="/" element={<BookListPage />} />
                        <Route path="/books/:id" element={<BookDetailsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route 
                            path="/add-book" 
                            element={<PrivateRoute><BookFormPage /></PrivateRoute>} 
                        />
                        <Route 
                            path="/edit-book/:id" 
                            element={<PrivateRoute><BookFormPage /></PrivateRoute>} 
                        />
                    </Routes>
                </Container>
            </div>
        </Router>
    </AuthProvider>
  );
}

export default App;