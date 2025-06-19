
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useGame } from '../context/GameContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication - in real app, this would call an API
    const mockUser = {
      id: '1',
      email,
      name: isRegister ? name : 'Bootstrap Warrior',
    };

    dispatch({ type: 'LOGIN', payload: mockUser });
    navigate('/game');
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">🧟‍♂️ {isRegister ? 'Join the Fight' : 'Enter the Battle'}</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  {isRegister && (
                    <Form.Group className="mb-3">
                      <Form.Label>Warrior Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your warrior name"
                      />
                    </Form.Group>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" className="w-100">
                    {isRegister ? 'Join Battle' : 'Enter Battle'}
                  </Button>
                </Form>
                
                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={() => setIsRegister(!isRegister)}
                    style={{ color: '#8b5cf6' }}
                  >
                    {isRegister ? 'Already a warrior? Sign in' : "New recruit? Join the fight"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
