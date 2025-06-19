
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // First get the game stats
        const { data: gameStats, error: gameStatsError } = await supabase
          .from('game_stats')
          .select('user_id, high_score, total_games, levels_completed')
          .order('high_score', { ascending: false })
          .limit(10);

        if (gameStatsError) throw gameStatsError;

        if (!gameStats || gameStats.length === 0) {
          setLeaderboardData([
            { display_name: "FlexMaster", high_score: 15420, total_games: 25, levels_completed: 8 },
            { display_name: "BootstrapPro", high_score: 12890, total_games: 18, levels_completed: 7 },
            { display_name: "ZombieSlayer", high_score: 11230, total_games: 22, levels_completed: 6 },
            { display_name: "GridGuru", high_score: 9870, total_games: 15, levels_completed: 5 },
            { display_name: "FlexNinja", high_score: 8450, total_games: 12, levels_completed: 4 },
          ]);
          return;
        }

        // Then get the profiles for these users
        const userIds = gameStats.map(stat => stat.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combine the data
        const formattedData = gameStats.map(stat => {
          const profile = profiles?.find(p => p.id === stat.user_id);
          return {
            display_name: profile?.display_name || 'Anonymous Player',
            high_score: stat.high_score,
            total_games: stat.total_games,
            levels_completed: stat.levels_completed
          };
        });

        setLeaderboardData(formattedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to mock data if there's an error
        setLeaderboardData([
          { display_name: "FlexMaster", high_score: 15420, total_games: 25, levels_completed: 8 },
          { display_name: "BootstrapPro", high_score: 12890, total_games: 18, levels_completed: 7 },
          { display_name: "ZombieSlayer", high_score: 11230, total_games: 22, levels_completed: 6 },
          { display_name: "GridGuru", high_score: 9870, total_games: 15, levels_completed: 5 },
          { display_name: "FlexNinja", high_score: 8450, total_games: 12, levels_completed: 4 },
        ]);
      } finally {
        setLoading(false);
      }
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
