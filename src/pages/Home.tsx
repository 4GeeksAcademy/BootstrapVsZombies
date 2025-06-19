
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Home: React.FC = () => {
  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h1 className="display-4 fw-bold text-primary mb-4">
              Bootstrap Flex Fighters
            </h1>
            <p className="lead">
              Learn Bootstrap flex utilities through an exciting tower defense game! 
              Defend your webpage from zombies by mastering flex properties.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <Card.Title className="text-success">🎮 Play & Learn</Card.Title>
                <Card.Text>
                  Use Bootstrap flex classes to position your defenses and stop the zombie invasion!
                </Card.Text>
                <Link to="/game">
                  <Button variant="success" size="lg">
                    Start Game
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <Card.Title className="text-info">📊 Leaderboard</Card.Title>
                <Card.Text>
                  Compete with other students and track your progress in mastering flex properties.
                </Card.Text>
                <Link to="/leaderboard">
                  <Button variant="info" size="lg">
                    View Scores
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="bg-light">
              <Card.Header>
                <h3>How to Play</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5>🧟 Zombie Invasion</h5>
                    <p>Zombies spawn at the bottom and move upward through your 12-column Bootstrap grid.</p>
                    
                    <h5>🛡️ Flex Turrets</h5>
                    <p>Place flex containers that shoot pellets. Select the right flex class to aim at zombies in their lane.</p>
                  </Col>
                  <Col md={6}>
                    <h5>🎯 Bootstrap Classes</h5>
                    <p>Master classes like <code>justify-content-center</code>, <code>align-items-start</code>, and more!</p>
                    
                    <h5>🏆 Endless Challenge</h5>
                    <p>Survive as long as possible and achieve the highest score!</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
