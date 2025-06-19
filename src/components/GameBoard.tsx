
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const GameBoard: React.FC = () => {
  // Create 12 columns for Bootstrap grid
  const columns = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Container fluid className="game-board p-3">
      <Row className="h-100">
        {columns.map((col) => (
          <Col key={col} xs={1} className="p-1 h-100 border border-secondary border-opacity-25">
            <div className="h-100 position-relative">
              {/* This is where flex turrets and zombies will be positioned */}
              <div 
                className="flex-turret mb-2" 
                style={{ height: '60px' }}
                title={`Column ${col + 1}`}
              >
                <small>Col {col + 1}</small>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GameBoard;
