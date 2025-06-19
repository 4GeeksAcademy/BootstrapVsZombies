import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface GameSession {
  id: string;
  score: number;
  level_reached: number;
  zombies_defeated: number;
  duration_seconds: number;
  completed_at: string;
}

interface GameStats {
  total_games: number;
  high_score: number;
  total_score: number;
  levels_completed: number;
  zombies_defeated: number;
}

const AUTHORIZED_EMAIL = 'sebasmiramontes@gmail.com';

const BackendTest: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form states for testing
  const [testScore, setTestScore] = useState('');
  const [testLevel, setTestLevel] = useState('');
  const [testZombies, setTestZombies] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user && user.email !== AUTHORIZED_EMAIL) {
      setMessage({ type: 'error', text: 'Access denied. This tool is restricted to authorized users only.' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else if (user && user.email === AUTHORIZED_EMAIL) {
      fetchGameData();
    }
  }, [user, loading, navigate]);

  const fetchGameData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch game stats
      const { data: statsData, error: statsError } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      setGameStats(statsData);

      // Fetch game sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (sessionsError) throw sessionsError;

      setGameSessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch game data' });
    } finally {
      setIsLoading(false);
    }
  };

  const addTestScore = async () => {
    if (!user || !testScore) return;

    const score = parseInt(testScore);
    const level = parseInt(testLevel) || 1;
    const zombies = parseInt(testZombies) || Math.floor(score / 100);
    const duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes

    setIsLoading(true);
    try {
      // Create game session
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          score,
          level_reached: level,
          zombies_defeated: zombies,
          duration_seconds: duration
        });

      if (sessionError) throw sessionError;

      // Update game stats
      const currentStats = gameStats || {
        total_games: 0,
        high_score: 0,
        total_score: 0,
        levels_completed: 0,
        zombies_defeated: 0
      };

      const updatedStats = {
        total_games: currentStats.total_games + 1,
        high_score: Math.max(currentStats.high_score, score),
        total_score: currentStats.total_score + score,
        levels_completed: Math.max(currentStats.levels_completed, level),
        zombies_defeated: currentStats.zombies_defeated + zombies
      };

      const { error: statsError } = await supabase
        .from('game_stats')
        .upsert({
          user_id: user.id,
          ...updatedStats
        }, {
          onConflict: 'user_id'
        });

      if (statsError) throw statsError;

      setMessage({ type: 'success', text: 'Test score added successfully!' });
      setTestScore('');
      setTestLevel('');
      setTestZombies('');
      await fetchGameData();
    } catch (error) {
      console.error('Error adding test score:', error);
      setMessage({ type: 'error', text: 'Failed to add test score' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomScore = () => {
    const randomScore = Math.floor(Math.random() * 10000) + 1000;
    const randomLevel = Math.floor(Math.random() * 10) + 1;
    const randomZombies = Math.floor(randomScore / 100) + Math.floor(Math.random() * 50);
    
    setTestScore(randomScore.toString());
    setTestLevel(randomLevel.toString());
    setTestZombies(randomZombies.toString());
  };

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

  if (!user || user.email !== AUTHORIZED_EMAIL) {
    return (
      <>
        <Navigation />
        <Container>
          <Row>
            <Col>
              <Alert variant="danger" className="text-center">
                <h4>Access Denied</h4>
                <p>This tool is restricted to authorized users only.</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col>
            <h2 className="mb-4">🧪 Backend Testing Dashboard</h2>
            
            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Add Test Score</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Score</Form.Label>
                            <Form.Control
                              type="number"
                              value={testScore}
                              onChange={(e) => setTestScore(e.target.value)}
                              placeholder="Enter score"
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Level Reached</Form.Label>
                            <Form.Control
                              type="number"
                              value={testLevel}
                              onChange={(e) => setTestLevel(e.target.value)}
                              placeholder="Level"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Zombies Defeated</Form.Label>
                        <Form.Control
                          type="number"
                          value={testZombies}
                          onChange={(e) => setTestZombies(e.target.value)}
                          placeholder="Zombies defeated"
                        />
                      </Form.Group>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          onClick={addTestScore}
                          disabled={isLoading || !testScore}
                        >
                          {isLoading ? 'Adding...' : 'Add Test Score'}
                        </Button>
                        <Button variant="outline-secondary" onClick={generateRandomScore}>
                          Generate Random Score
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Your Game Statistics</h5>
                  </Card.Header>
                  <Card.Body>
                    {gameStats ? (
                      <div>
                        <p><strong>Total Games:</strong> {gameStats.total_games}</p>
                        <p><strong>High Score:</strong> {gameStats.high_score.toLocaleString()}</p>
                        <p><strong>Total Score:</strong> {gameStats.total_score.toLocaleString()}</p>
                        <p><strong>Levels Completed:</strong> {gameStats.levels_completed}</p>
                        <p><strong>Zombies Defeated:</strong> {gameStats.zombies_defeated}</p>
                      </div>
                    ) : (
                      <p>No game data yet. Add a test score to get started!</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header>
                <h5>Recent Game Sessions</h5>
              </Card.Header>
              <Card.Body>
                {gameSessions.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Score</th>
                        <th>Level</th>
                        <th>Zombies</th>
                        <th>Duration</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameSessions.map((session) => (
                        <tr key={session.id}>
                          <td>{session.score.toLocaleString()}</td>
                          <td>{session.level_reached}</td>
                          <td>{session.zombies_defeated}</td>
                          <td>{Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s</td>
                          <td>{new Date(session.completed_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No game sessions yet. Add some test scores to see them here!</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BackendTest;
