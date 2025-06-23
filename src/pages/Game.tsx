
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import GameBoard from '../components/GameBoard';
import ClassSelector from '../components/ClassSelector';
import GameStats from '../components/GameStats';
import { useAuth } from '../hooks/useAuth';

const Game: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <Container>
          <div className="text-center">Loading...</div>
        </Container>
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Navigation />
      <Container fluid>
        <Row>
          <Col lg={9}>
            <GameStats />
            <GameBoard />
          </Col>
          <Col lg={3}>
            <ClassSelector />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Game;
