
import React from 'react';
import { Card, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { useGame } from '../context/GameContext';

const ClassSelector: React.FC = () => {
  const { state, dispatch } = useGame();

  const flexClasses = [
    {
      name: 'justify-content-start',
      description: 'Align items to the start',
      category: 'Horizontal Alignment'
    },
    {
      name: 'justify-content-center',
      description: 'Center items horizontally',
      category: 'Horizontal Alignment'
    },
    {
      name: 'justify-content-end',
      description: 'Align items to the end',
      category: 'Horizontal Alignment'
    },
    {
      name: 'align-items-start',
      description: 'Align items to the top',
      category: 'Vertical Alignment'
    },
    {
      name: 'align-items-center',
      description: 'Center items vertically',
      category: 'Vertical Alignment'
    },
    {
      name: 'align-items-end',
      description: 'Align items to the bottom',
      category: 'Vertical Alignment'
    }
  ];

  const handleClassSelect = (className: string) => {
    dispatch({ type: 'SELECT_FLEX_CLASS', payload: className });
  };

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
        <h5 className="mb-0">Bootstrap Flex Classes</h5>
      </Card.Header>
      <Card.Body>
        {state.selectedFlexClass && (
          <Alert variant="success" className="mb-3">
            <strong>Selected:</strong> <code>{state.selectedFlexClass}</code>
          </Alert>
        )}

        {Object.entries(groupedClasses).map(([category, classes]) => (
          <div key={category} className="mb-4">
            <h6 className="text-muted">{category}</h6>
            <ButtonGroup vertical className="w-100">
              {classes.map((flexClass) => (
                <Button
                  key={flexClass.name}
                  variant={state.selectedFlexClass === flexClass.name ? 'primary' : 'outline-primary'}
                  onClick={() => handleClassSelect(flexClass.name)}
                  className="text-start mb-2"
                >
                  <div>
                    <code className="d-block">{flexClass.name}</code>
                    <small className="text-muted">{flexClass.description}</small>
                  </div>
                </Button>
              ))}
            </ButtonGroup>
          </div>
        ))}

        <div className="mt-4">
          <Card className="bg-light">
            <Card.Body>
              <h6>Visual Demo</h6>
              <div className={`flex-demo d-flex ${state.selectedFlexClass || ''}`}>
                <div className="bg-primary text-white p-2 m-1 rounded">Item 1</div>
                <div className="bg-success text-white p-2 m-1 rounded">Item 2</div>
                <div className="bg-warning text-dark p-2 m-1 rounded">Item 3</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClassSelector;
