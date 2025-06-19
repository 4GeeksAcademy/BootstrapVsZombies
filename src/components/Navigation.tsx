
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Navigation: React.FC = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            <strong>Bootstrap Flex Fighters</strong>
          </Link>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/game" className="nav-link">Game</Link>
            <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          </Nav>
          
          <Nav>
            {state.isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {state.user?.name}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
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
