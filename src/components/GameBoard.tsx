
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * GameBoard Component
 * 
 * The main game area representing the Bootstrap grid battlefield.
 * This component demonstrates Bootstrap's 12-column grid system in an interactive way.
 * 
 * Educational Value:
 * - Visualizes Bootstrap's 12-column grid system
 * - Shows how to create responsive layouts using Bootstrap containers, rows, and columns
 * - Demonstrates CSS positioning for game elements
 * - Provides a practical example of flexbox containers (future turret placement)
 * 
 * Bootstrap Concepts Demonstrated:
 * - Container-fluid for full-width layouts
 * - Row and Column components for grid structure
 * - xs={1} creates equal-width columns (12 columns total)
 * - Border utilities for visual grid representation
 * - Padding and spacing utilities
 * - Height utilities and responsive design
 * 
 * Game Mechanics:
 * - Each column represents a lane where zombies can spawn and move
 * - Players will place Bootstrap flex turrets in these columns
 * - The grid serves as both the battlefield and the educational canvas
 */
const GameBoard: React.FC = () => {
  // Create array representing Bootstrap's 12-column system
  // This makes the grid system tangible and interactive
  const columns = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Container fluid className="game-board p-3">
      <Row className="h-100">
        {/* Map over 12 columns to create the Bootstrap grid battlefield */}
        {columns.map((col) => (
          <Col 
            key={col} 
            xs={1}                    // Each column takes 1/12 of the width
            className="p-1 h-100 border border-secondary border-opacity-25"
          >
            <div className="h-100 position-relative">
              {/* 
                Turret placement area
                This is where students will place Bootstrap flex containers
                as defensive turrets using their selected flex classes
              */}
              <div 
                className="flex-turret mb-2" 
                style={{ height: '60px' }}
                title={`Column ${col + 1} - Click to place turret`}
              >
                <small>Col {col + 1}</small>
              </div>
              
              {/* 
                Future zombie and pellet rendering area
                Game entities will be positioned here using CSS transforms
                This demonstrates how Bootstrap grid can be combined with
                dynamic positioning for interactive applications
              */}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GameBoard;
