
import React from 'react';
import { Card, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { useGame } from '../context/GameContext';

/**
 * ClassSelector Component
 * 
 * The educational heart of Bootstrap vs Zombies - teaches Bootstrap flexbox utilities
 * through interactive gameplay. Students learn by selecting and applying flex classes.
 * 
 * Educational Objectives:
 * - Teach Bootstrap flexbox utility classes through hands-on practice
 * - Demonstrate the difference between horizontal and vertical alignment
 * - Show real-time visual feedback of flex properties
 * - Connect CSS concepts to practical game mechanics
 * 
 * Bootstrap Concepts Taught:
 * - justify-content utilities for horizontal alignment
 * - align-items utilities for vertical alignment  
 * - Flexbox container behavior and item positioning
 * - Bootstrap component composition (Cards, Buttons, Alerts)
 * 
 * Pedagogical Approach:
 * - Visual learning through interactive demo
 * - Categorized learning (horizontal vs vertical alignment)
 * - Immediate feedback with visual demonstration
 * - Contextual application (turret targeting mechanics)
 */
const ClassSelector: React.FC = () => {
  const { state, dispatch } = useGame();

  /**
   * Bootstrap Flexbox Classes for Game Mechanics
   * Each class serves both educational and gameplay purposes:
   * - Students learn the CSS property
   * - The class determines turret targeting behavior
   */
  const flexClasses = [
    // Horizontal Alignment Classes (justify-content)
    {
      name: 'justify-content-start',
      description: 'Align items to the start',
      category: 'Horizontal Alignment',
      gameEffect: 'Turret targets zombies on the left side of the lane'
    },
    {
      name: 'justify-content-center',
      description: 'Center items horizontally',
      category: 'Horizontal Alignment',
      gameEffect: 'Turret targets zombies in the center of the lane'
    },
    {
      name: 'justify-content-end',
      description: 'Align items to the end',
      category: 'Horizontal Alignment',
      gameEffect: 'Turret targets zombies on the right side of the lane'
    },
    
    // Vertical Alignment Classes (align-items)
    {
      name: 'align-items-start',
      description: 'Align items to the top',
      category: 'Vertical Alignment',
      gameEffect: 'Turret targets zombies at the top of the lane'
    },
    {
      name: 'align-items-center',
      description: 'Center items vertically',
      category: 'Vertical Alignment',
      gameEffect: 'Turret targets zombies in the middle of the lane'
    },
    {
      name: 'align-items-end',
      description: 'Align items to the bottom',
      category: 'Vertical Alignment',
      gameEffect: 'Turret targets zombies at the bottom of the lane'
    }
  ];

  /**
   * Handles flex class selection
   * Updates game state and prepares for turret placement
   * 
   * @param className - The Bootstrap flex class name to select
   */
  const handleClassSelect = (className: string) => {
    dispatch({ type: 'SELECT_FLEX_CLASS', payload: className });
  };

  /**
   * Groups flex classes by category for organized learning
   * Separates horizontal and vertical alignment for clearer understanding
   */
  const groupedClasses = flexClasses.reduce((acc, flexClass) => {
    if (!acc[flexClass.category]) {
      acc[flexClass.category] = [];
    }
    acc[flexClass.category].push(flexClass);
    return acc;
  }, {} as Record<string, typeof flexClasses>);

  return (
    <Card className="class-selector h-100">
      <Card.Header>
        <h5 className="mb-0">🎯 Bootstrap Flex Arsenal</h5>
        <small className="text-muted">Choose your weapon against the undead!</small>
      </Card.Header>
      <Card.Body>
        {/* Current Selection Feedback */}
        {state.selectedFlexClass && (
          <Alert variant="success" className="mb-3">
            <strong>Selected Weapon:</strong> <code>{state.selectedFlexClass}</code>
            <br />
            <small>Ready to deploy your flex turret!</small>
          </Alert>
        )}

        {/* Categorized Class Selection */}
        {Object.entries(groupedClasses).map(([category, classes]) => (
          <div key={category} className="mb-4">
            <h6 className="text-muted border-bottom pb-2">{category}</h6>
            <div className="d-grid gap-2">
              {classes.map((flexClass) => (
                <Button
                  key={flexClass.name}
                  variant={state.selectedFlexClass === flexClass.name ? 'primary' : 'outline-primary'}
                  onClick={() => handleClassSelect(flexClass.name)}
                  className="text-start p-3"
                  size="sm"
                >
                  <div>
                    {/* Class name in code format for recognition */}
                    <code className="d-block fw-bold">{flexClass.name}</code>
                    {/* Human-readable description */}
                    <small className="text-muted d-block">{flexClass.description}</small>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Interactive Visual Demonstration */}
        <div className="mt-4">
          <Card className="bg-light border-0">
            <Card.Body>
              <h6 className="mb-3">🔬 Live Demo Lab</h6>
              <p className="small text-muted mb-2">
                See your selected flex class in action:
              </p>
              
              {/* Visual demonstration container */}
              <div 
                className={`flex-demo d-flex border rounded p-3 bg-white ${state.selectedFlexClass || ''}`}
                style={{ minHeight: '80px' }}
              >
                {/* Demo flex items representing game elements */}
                <div className="bg-primary text-white p-2 m-1 rounded small">🛡️ Turret</div>
                <div className="bg-success text-white p-2 m-1 rounded small">🎯 Target</div>
                <div className="bg-warning text-dark p-2 m-1 rounded small">💥 Effect</div>
              </div>
              
              {/* Explanation of current selection */}
              {state.selectedFlexClass && (
                <div className="mt-2">
                  <small className="text-info">
                    <strong>Effect:</strong> Items are positioned using <code>{state.selectedFlexClass}</code>
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Educational Tip */}
        <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
          <small>
            <strong>💡 Pro Tip:</strong> Each flex class you choose determines how your turret 
            targets zombies. Master these Bootstrap utilities to become the ultimate zombie slayer!
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClassSelector;
