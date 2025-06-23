// src/pages/Leaderboard.tsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Grab the return‐row type from your auto-generated types:
type LeaderboardRow =
  Database["public"]["Functions"]["get_leaderboard_data"]["Returns"][number];

const Leaderboard: React.FC = () => {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);

      // no generics here, our `types.ts` knows get_leaderboard_data → LeaderboardRow[]
      const { data, error } = await supabase
        .rpc("get_leaderboard_data", {} as Record<string, never>);

      if (error) {
        console.error("RPC error:", error);
      } else {
        setRows(data ?? []);
      }

      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card bg="dark" text="light">
              <Card.Header>
                <h3>🏆 Bootstrap vs Zombies: Hall of Fame</h3>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div>Loading…</div>
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
                      {rows.map((r, i) => (
                        <TableRow key={r.display_name + i}>
                          <TableCell>
                            <strong>#{i + 1}</strong>{" "}
                            {i === 0
                              ? "👑"
                              : i === 1
                              ? "🥈"
                              : i === 2
                              ? "🥉"
                              : ""}
                          </TableCell>
                          <TableCell>{r.display_name ?? "Unknown"}</TableCell>
                          <TableCell className="text-success">
                            <strong>{r.high_score.toLocaleString()}</strong>
                          </TableCell>
                          <TableCell>{r.total_games}</TableCell>
                          <TableCell>{r.levels_completed}</TableCell>
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







