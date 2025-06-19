
import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import Navigation from '../components/Navigation';

const Leaderboard: React.FC = () => {
  // Mock data for now
  const leaderboardData = [
    { rank: 1, name: "FlexMaster", score: 15420 },
    { rank: 2, name: "BootstrapPro", score: 12890 },
    { rank: 3, name: "CSSWarrior", score: 11230 },
    { rank: 4, name: "GridGuru", score: 9870 },
    { rank: 5, name: "FlexNinja", score: 8450 },
  ];

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h3 className="mb-0">🏆 Leaderboard</h3>
              </Card.Header>
              <Card.Body>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>High Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player) => (
                      <tr key={player.rank}>
                        <td>
                          <strong>#{player.rank}</strong>
                        </td>
                        <td>{player.name}</td>
                        <td className="text-success">
                          <strong>{player.score.toLocaleString()}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Leaderboard;
