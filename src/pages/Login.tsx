
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        const { data, error } = await signUp(email, password, name);
        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at) {
          setError('Please check your email and click the confirmation link to complete registration.');
        } else if (data.user) {
          navigate('/game');
        }
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        
        if (data.user) {
          navigate('/game');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
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
                        disabled={loading}
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
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Loading...' : (isRegister ? 'Join Battle' : 'Enter Battle')}
                  </Button>
                </Form>
                
                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={() => setIsRegister(!isRegister)}
                    style={{ color: '#8b5cf6' }}
                    disabled={loading}
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
