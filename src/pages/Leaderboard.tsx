import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navigation from '../components/Navigation';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  display_name: string;
  high_score: number;
  total_games: number;
  levels_completed: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_stats')
        .select(`
          user_id,
          high_score,
          total_games,
          levels_completed,
          profiles (
            display_name
          )
        `)
        .order('high_score', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        const formatted = data.map((entry: any) => ({
          display_name: entry.profiles?.display_name || 'Unknown',
          high_score: entry.high_score,
          total_games: entry.total_games,
          levels_completed: entry.levels_completed,
        }));
        setLeaderboardData(formatted);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card>
              <Card.Header>
                <h3 className="mb-0">🏆 Bootstrap vs Zombies - Hall of Fame</h3>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center">Loading leaderboard...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Bootstrap Warrior</TableHead>
                        <TableHead>High Score</TableHead>
                        <TableHead>Games Played</TableHead>
                        <TableHead>Levels Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((player, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <strong>#{index + 1}</strong>
                            {index === 0 && ' 👑'}
                            {index === 1 && ' 🥈'}
                            {index === 2 && ' 🥉'}
                          </TableCell>
                          <TableCell>{player.display_name}</TableCell>
                          <TableCell className="text-success">
                            <strong>{player.high_score.toLocaleString()}</strong>
                          </TableCell>
                          <TableCell>{player.total_games}</TableCell>
                          <TableCell>{player.levels_completed}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Leaderboard;


