
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>🧟‍♂️ Bootstrap vs Zombies</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {user && (
              <LinkContainer to="/game">
                <Nav.Link>Game</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/leaderboard">
              <Nav.Link>Leaderboard</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <span className="text-light">
                    Welcome, {user.user_metadata?.display_name || user.email}!
                  </span>
                </Nav.Item>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <LinkContainer to="/login">
                <Button variant="outline-light" size="sm">Login</Button>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
