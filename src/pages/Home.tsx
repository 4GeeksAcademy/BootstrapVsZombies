
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
            <h1 className="display-4 fw-bold mb-4">
              🧟‍♂️ Bootstrap vs Zombies
            </h1>
            <p className="lead">
              Master Bootstrap flex utilities in an epic tower defense battle! 
              Use your CSS skills to position defenses and survive the zombie apocalypse.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <Card.Title className="text-success">🎮 Battle Mode</Card.Title>
                <Card.Text>
                  Deploy Bootstrap flex classes strategically to create an impenetrable defense grid against the undead horde!
                </Card.Text>
                <Link to="/game">
                  <Button variant="success" size="lg">
                    Start Battle
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <Card.Title className="text-info">🏆 Hall of Fame</Card.Title>
                <Card.Text>
                  Check the leaderboard to see who are the ultimate Bootstrap warriors and zombie slayers.
                </Card.Text>
                <Link to="/leaderboard">
                  <Button variant="info" size="lg">
                    View Heroes
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card>
              <Card.Header>
                <h3>⚔️ How to Survive</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5>🧟‍♂️ Zombie Invasion</h5>
                    <p>Undead creatures spawn from the bottom of your 12-column Bootstrap grid and march relentlessly upward.</p>
                    
                    <h5>🛡️ Flex Defense Towers</h5>
                    <p>Deploy flex containers as defensive turrets. Choose the right Bootstrap flex class to target zombies in their path.</p>
                  </Col>
                  <Col md={6}>
                    <h5>🎯 Master Bootstrap Classes</h5>
                    <p>Learn essential classes like <code>justify-content-center</code>, <code>align-items-start</code>, and more through combat!</p>
                    
                    <h5>🏆 Endless Survival</h5>
                    <p>Survive wave after wave to achieve the highest score and become a Bootstrap legend!</p>
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
