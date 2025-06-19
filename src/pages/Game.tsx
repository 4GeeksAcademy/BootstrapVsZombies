
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import GameBoard from '../components/GameBoard';
import ClassSelector from '../components/ClassSelector';
import GameStats from '../components/GameStats';
import { useGame } from '../context/GameContext';

const Game: React.FC = () => {
  const { state } = useGame();

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
