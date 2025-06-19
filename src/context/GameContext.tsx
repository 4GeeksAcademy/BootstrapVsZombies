
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Game state interface
interface GameState {
  score: number;
  lives: number;
  level: number;
  isPlaying: boolean;
  selectedFlexClass: string | null;
  zombies: Zombie[];
  pellets: Pellet[];
  isAuthenticated: boolean;
  user: User | null;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Zombie {
  id: string;
  lane: number;
  position: number;
  health: number;
  speed: number;
}

interface Pellet {
  id: string;
  lane: number;
  position: number;
  damage: number;
}

// Action types
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'LOSE_LIFE' }
  | { type: 'SELECT_FLEX_CLASS'; payload: string }
  | { type: 'ADD_ZOMBIE'; payload: Zombie }
  | { type: 'REMOVE_ZOMBIE'; payload: string }
  | { type: 'ADD_PELLET'; payload: Pellet }
  | { type: 'REMOVE_PELLET'; payload: string }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_ZOMBIES'; payload: Zombie[] }
  | { type: 'UPDATE_PELLETS'; payload: Pellet[] };

// Initial state
const initialState: GameState = {
  score: 0,
  lives: 3,
  level: 1,
  isPlaying: false,
  selectedFlexClass: null,
  zombies: [],
  pellets: [],
  isAuthenticated: false,
  user: null,
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, isPlaying: true, score: 0, lives: 3, level: 1 };
    case 'END_GAME':
      return { ...state, isPlaying: false };
    case 'UPDATE_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'LOSE_LIFE':
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case 'SELECT_FLEX_CLASS':
      return { ...state, selectedFlexClass: action.payload };
    case 'ADD_ZOMBIE':
      return { ...state, zombies: [...state.zombies, action.payload] };
    case 'REMOVE_ZOMBIE':
      return { ...state, zombies: state.zombies.filter(z => z.id !== action.payload) };
    case 'ADD_PELLET':
      return { ...state, pellets: [...state.pellets, action.payload] };
    case 'REMOVE_PELLET':
      return { ...state, pellets: state.pellets.filter(p => p.id !== action.payload) };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'UPDATE_ZOMBIES':
      return { ...state, zombies: action.payload };
    case 'UPDATE_PELLETS':
      return { ...state, pellets: action.payload };
    default:
      return state;
  }
}

// Context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
