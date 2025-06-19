
import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useGame } from '../context/GameContext';

const GameStats: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleEndGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  return (
    <Row className="mb-3">
      <Col>
        <Card className="game-stats">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3}>
                <h5 className="mb-0">Score: <span className="text-warning">{state.score}</span></h5>
              </Col>
              <Col md={3}>
                <h5 className="mb-0">Lives: <span className="text-danger">{'❤️'.repeat(state.lives)}</span></h5>
              </Col>
              <Col md={3}>
                <h5 className="mb-0">Level: <span className="text-info">{state.level}</span></h5>
              </Col>
              <Col md={3} className="text-end">
                {!state.isPlaying ? (
                  <Button variant="success" onClick={handleStartGame}>
                    Start Game
                  </Button>
                ) : (
                  <Button variant="danger" onClick={handleEndGame}>
                    End Game
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GameStats;
