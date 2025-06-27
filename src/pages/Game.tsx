import React, { useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import GameBoard from '../components/GameBoard';
import ClassSelector from '../components/ClassSelector';
import GameStats from '../components/GameStats';
import { useAuth } from '../hooks/useAuth';
import PhaserGame from '../components/PhaserGame';

const Game: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const phaserRef = useRef(null);
  const changeScene = () => {

    const scene = phaserRef.current.scene;

    if (scene) {
      scene.changeScene();
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    // Emitir el usuario a Phaser cuando esté disponible
    if (user) {
      // Lazy import para evitar problemas de SSR o duplicidad
      import('../game/EventBus').then(({ EventBus, USER_EVENT }) => {
        EventBus.emit(USER_EVENT, user);
      });
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
          <PhaserGame ref={phaserRef} />
          <div>
            <button className="button" onClick={changeScene}>Reset Scene</button>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Game;
