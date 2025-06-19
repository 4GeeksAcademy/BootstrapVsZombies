
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
  // Mock data for now
  const leaderboardData = [
    { rank: 1, name: "FlexMaster", score: 15420 },
    { rank: 2, name: "BootstrapPro", score: 12890 },
    { rank: 3, name: "ZombieSlayer", score: 11230 },
    { rank: 4, name: "GridGuru", score: 9870 },
    { rank: 5, name: "FlexNinja", score: 8450 },
  ];

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
