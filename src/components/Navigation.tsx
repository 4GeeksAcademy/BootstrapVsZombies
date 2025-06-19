
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

/**
 * Navigation Component
 * 
 * Provides the main navigation bar for the Bootstrap vs Zombies application.
 * Demonstrates Bootstrap navbar components and React Router integration.
 * 
 * Educational Value:
 * - Shows Bootstrap navbar structure and responsive behavior
 * - Demonstrates conditional rendering based on authentication state
 * - Integrates React Router for single-page application navigation
 * - Uses React Context for state management across components
 * 
 * Bootstrap Concepts Demonstrated:
 * - Navbar with brand, toggle, and collapsible content
 * - Responsive navigation that collapses on mobile
 * - Bootstrap utility classes for spacing and alignment
 * - Dark theme variant
 */
const Navigation: React.FC = () => {
  // Access global game state and dispatch function
  const { state, dispatch } = useGame();
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles user logout
   * Dispatches logout action and redirects to home page
   */
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    // Bootstrap navbar with dark theme and responsive behavior
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Brand/Logo section */}
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            <strong>🧟‍♂️ Bootstrap vs Zombies</strong>
          </Link>
        </Navbar.Brand>
        
        {/* Mobile hamburger toggle button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Collapsible navigation content */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-aligned navigation links */}
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/game" className="nav-link">Game</Link>
            <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          </Nav>
          
          {/* Right-aligned authentication section */}
          <Nav>
            {/* Conditional rendering based on authentication state */}
            {state.isAuthenticated ? (
              <>
                {/* Welcome message for authenticated users */}
                <Navbar.Text className="me-3">
                  Welcome, {state.user?.name}!
                </Navbar.Text>
                {/* Logout button */}
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              /* Login link for unauthenticated users */
              <Link to="/login">
                <Button variant="outline-light">Login</Button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
