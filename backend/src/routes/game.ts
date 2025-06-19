
/**
 * Game Session Routes
 * 
 * Handles game state persistence, session management, and game analytics.
 * Provides endpoints for starting, updating, and completing game sessions.
 * 
 * Educational Value:
 * - Demonstrates real-time game state management
 * - Shows how to persist game progress
 * - Implements game analytics collection
 * - Provides RESTful API design patterns
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * Game Session Interface
 * Represents a complete game playthrough with all relevant data
 */
interface GameSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  finalScore: number;
  level: number;
  lives: number;
  selectedFlexClasses: string[];
  zombiesKilled: number;
  accuracy: number;
  gameEvents: GameEvent[];
  isCompleted: boolean;
}

/**
 * Game Event Interface
 * Tracks individual actions during gameplay for analytics
 */
interface GameEvent {
  id: string;
  type: 'TURRET_PLACED' | 'ZOMBIE_KILLED' | 'LIFE_LOST' | 'LEVEL_UP' | 'FLEX_CLASS_SELECTED';
  timestamp: Date;
  data: any;
}

// Temporary in-memory storage for game sessions
const gameSessions: GameSession[] = [];

/**
 * POST /api/game/start
 * Start a new game session
 */
router.post('/start', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    // Create new game session
    const gameSession: GameSession = {
      id: Date.now().toString(),
      userId,
      startTime: new Date(),
      finalScore: 0,
      level: 1,
      lives: 3,
      selectedFlexClasses: [],
      zombiesKilled: 0,
      accuracy: 100,
      gameEvents: [],
      isCompleted: false
    };

    gameSessions.push(gameSession);

    res.status(201).json({
      message: 'Game session started',
      session: gameSession
    });

  } catch (error) {
    console.error('Game start error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to start game session'
    });
  }
});

/**
 * PUT /api/game/:sessionId
 * Update game session progress
 */
router.put('/:sessionId', [
  authenticateToken,
  body('score').optional().isNumeric(),
  body('level').optional().isNumeric(),
  body('lives').optional().isNumeric(),
  body('zombiesKilled').optional().isNumeric(),
  body('accuracy').optional().isNumeric()
], (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { sessionId } = req.params;
    const userId = (req as any).user?.userId;
    const updateData = req.body;

    // Find game session
    const sessionIndex = gameSessions.findIndex(
      session => session.id === sessionId && session.userId === userId
    );

    if (sessionIndex === -1) {
      return res.status(404).json({
        error: 'Game session not found',
        message: 'Session does not exist or access denied'
      });
    }

    // Update session data
    const session = gameSessions[sessionIndex];
    Object.assign(session, updateData);

    res.json({
      message: 'Game session updated',
      session
    });

  } catch (error) {
    console.error('Game update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update game session'
    });
  }
});

/**
 * POST /api/game/:sessionId/event
 * Log a game event for analytics
 */
router.post('/:sessionId/event', [
  authenticateToken,
  body('type').isIn(['TURRET_PLACED', 'ZOMBIE_KILLED', 'LIFE_LOST', 'LEVEL_UP', 'FLEX_CLASS_SELECTED']),
  body('data').optional()
], (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { sessionId } = req.params;
    const userId = (req as any).user?.userId;
    const { type, data } = req.body;

    // Find game session
    const session = gameSessions.find(
      s => s.id === sessionId && s.userId === userId
    );

    if (!session) {
      return res.status(404).json({
        error: 'Game session not found',
        message: 'Session does not exist or access denied'
      });
    }

    // Create game event
    const gameEvent: GameEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      data: data || {}
    };

    session.gameEvents.push(gameEvent);

    res.status(201).json({
      message: 'Game event logged',
      event: gameEvent
    });

  } catch (error) {
    console.error('Event logging error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to log game event'
    });
  }
});

/**
 * POST /api/game/:sessionId/complete
 * Complete a game session and finalize score
 */
router.post('/:sessionId/complete', [
  authenticateToken,
  body('finalScore').isNumeric(),
  body('finalLevel').optional().isNumeric()
], (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { sessionId } = req.params;
    const userId = (req as any).user?.userId;
    const { finalScore, finalLevel } = req.body;

    // Find game session
    const sessionIndex = gameSessions.findIndex(
      session => session.id === sessionId && session.userId === userId
    );

    if (sessionIndex === -1) {
      return res.status(404).json({
        error: 'Game session not found',
        message: 'Session does not exist or access denied'
      });
    }

    // Complete session
    const session = gameSessions[sessionIndex];
    session.endTime = new Date();
    session.finalScore = finalScore;
    session.level = finalLevel || session.level;
    session.isCompleted = true;

    res.json({
      message: 'Game session completed',
      session,
      duration: session.endTime.getTime() - session.startTime.getTime()
    });

  } catch (error) {
    console.error('Game completion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to complete game session'
    });
  }
});

/**
 * GET /api/game/sessions
 * Get user's game session history
 */
router.get('/sessions', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { limit = 10, offset = 0 } = req.query;

    // Get user's sessions
    const userSessions = gameSessions
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(Number(offset), Number(offset) + Number(limit));

    const totalSessions = gameSessions.filter(session => session.userId === userId).length;

    res.json({
      sessions: userSessions,
      pagination: {
        total: totalSessions,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: totalSessions > Number(offset) + Number(limit)
      }
    });

  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch game sessions'
    });
  }
});

export default router;
