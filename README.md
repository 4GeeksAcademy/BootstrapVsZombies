
# 🧟‍♂️ Bootstrap vs Zombies

An educational tower defense game that teaches Bootstrap flexbox utilities through interactive gameplay. Students learn CSS fundamentals while defending against zombie hordes using Bootstrap's powerful grid and flex systems.

## 🎯 Educational Objectives

### Primary Learning Goals
- **Bootstrap Grid System**: Master the 12-column responsive grid layout
- **Flexbox Utilities**: Understand `justify-content` and `align-items` properties
- **Responsive Design**: Learn how Bootstrap handles different screen sizes
- **Component Architecture**: See how Bootstrap components work together
- **CSS-in-Practice**: Apply theoretical knowledge in a practical, engaging context

### Bootstrap Concepts Covered
- **Layout**: Container, Row, Column components
- **Flexbox**: justify-content-start/center/end, align-items-start/center/end
- **Components**: Navbar, Cards, Buttons, Tables, Forms, Alerts
- **Utilities**: Spacing, borders, colors, typography
- **Responsive**: Breakpoints and responsive behavior

## 🏗️ Project Architecture

### Frontend Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx   # Bootstrap navbar with authentication
│   ├── GameBoard.tsx    # 12-column grid battlefield
│   ├── ClassSelector.tsx # Flexbox utility learning interface
│   └── GameStats.tsx    # Game state display
├── pages/               # Route-level components
│   ├── Home.tsx         # Landing page with game introduction
│   ├── Game.tsx         # Main gameplay interface
│   ├── Leaderboard.tsx  # Score tracking and rankings
│   └── Login.tsx        # User authentication
├── context/             # Global state management
│   └── GameContext.tsx  # Game state and reducer logic
└── hooks/               # Custom React hooks
```

### Technology Stack
- **React 18** - Modern component-based UI library
- **TypeScript** - Type-safe development
- **Bootstrap 5.3** - CSS framework for responsive design
- **React Bootstrap** - Bootstrap components for React
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Vite** - Fast development build tool

### State Management Pattern
The project uses React's Context API with useReducer for predictable state management:

```typescript
// Centralized game state
interface GameState {
  score: number;
  lives: number;
  selectedFlexClass: string | null;
  zombies: Zombie[];
  // ... more state
}

// Action-based state updates
type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'SELECT_FLEX_CLASS'; payload: string }
  | { type: 'ADD_ZOMBIE'; payload: Zombie }
  // ... more actions
```

## 🎮 Game Mechanics

### Core Gameplay Loop
1. **Zombie Spawning**: Zombies appear at the bottom of random grid columns
2. **Class Selection**: Students choose Bootstrap flex utilities from the arsenal
3. **Turret Placement**: Deploy flex-powered turrets in grid columns
4. **Targeting Logic**: Turret behavior depends on selected flex class
5. **Defense Strategy**: Combine different flex classes for optimal defense

### Educational Integration
- **Visual Learning**: See flex properties in action through turret targeting
- **Immediate Feedback**: Visual demo shows effect of each flex class
- **Contextual Application**: Learn by doing, not just reading
- **Progressive Difficulty**: Advanced flex combinations in higher levels

### Flex Class Effects
| Bootstrap Class | Turret Behavior | Learning Outcome |
|----------------|----------------|------------------|
| `justify-content-start` | Targets left side of lane | Horizontal alignment basics |
| `justify-content-center` | Targets center of lane | Centering content |
| `justify-content-end` | Targets right side of lane | End alignment |
| `align-items-start` | Targets top of lane | Vertical alignment basics |
| `align-items-center` | Targets middle of lane | Vertical centering |
| `align-items-end` | Targets bottom of lane | Bottom alignment |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/bootstrap-vs-zombies.git
cd bootstrap-vs-zombies

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧑‍🏫 For Educators

### Classroom Integration
1. **Pre-Game**: Review Bootstrap documentation and basic flexbox concepts
2. **Guided Play**: Walk through first few levels together
3. **Independent Practice**: Students explore different flex combinations
4. **Discussion**: Analyze successful strategies and CSS patterns
5. **Extension**: Challenge students to predict turret behavior

### Assessment Opportunities
- **Formative**: Observe student flex class selections and strategies
- **Peer Learning**: Students explain their turret placement reasoning
- **Reflection**: Discuss how game mechanics relate to real web layouts
- **Portfolio**: Screenshot and document successful defense strategies

### Curriculum Alignment
- **Web Development Fundamentals**: CSS layout and positioning
- **Responsive Design**: Mobile-first development principles
- **Problem Solving**: Strategic thinking and pattern recognition
- **Computer Science**: State management and component architecture

## 🔧 Development Guide

### Component Documentation
Each component includes comprehensive JSDoc comments explaining:
- Educational purpose and learning objectives
- Bootstrap concepts demonstrated
- Props interfaces and usage examples
- Integration with game mechanics

### Code Organization Principles
- **Single Responsibility**: Each component has one clear purpose
- **Educational Clarity**: Code structure mirrors learning objectives
- **Type Safety**: Full TypeScript implementation with interfaces
- **Performance**: Optimized for smooth gameplay experience

### Adding New Features
1. **Educational First**: Ensure new features teach Bootstrap concepts
2. **Component Isolation**: Create focused, reusable components
3. **Documentation**: Add comprehensive comments and examples
4. **Testing**: Verify educational and technical functionality

## 🎯 Future Enhancements

### Backend Integration Planning
```
bootstrap-vs-zombies/
├── frontend/          # Current React application
├── backend/           # Flask API server
│   ├── auth/         # User authentication endpoints
│   ├── scores/       # Leaderboard management
│   ├── analytics/    # Learning progress tracking
│   └── game/         # Game state persistence
├── shared/           # TypeScript interfaces
└── database/         # PostgreSQL schema and migrations
```

### Flask API Overview

#### Environment Variables
- `FLASK_SECRET_KEY` – session secret used by Flask
- `JWT_SECRET_KEY` – key for signing JWT access tokens
- `DATABASE_URL` – SQLAlchemy database connection string
  (see [`backend/.env.example`](backend/.env.example))

#### Endpoints
- `POST /api/auth/register` – create a new user
- `POST /api/auth/login` – authenticate a user and return a JWT
- `GET /api/auth/me` – return the authenticated user profile

### Planned Features
- **User Accounts**: Persistent progress tracking
- **Analytics Dashboard**: Learning progress visualization  
- **Multiplayer Mode**: Collaborative Bootstrap learning
- **Advanced Levels**: Complex flex combinations and CSS Grid
- **Achievement System**: Badges for mastering specific concepts
- **Instructor Portal**: Classroom management and progress monitoring

## 📚 Learning Resources

### Bootstrap Documentation
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
- [Bootstrap Flexbox Utilities](https://getbootstrap.com/docs/5.3/utilities/flex/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)

### Game Development Concepts
- [React State Management](https://react.dev/learn/managing-state)
- [TypeScript for React](https://react.dev/learn/typescript)
- [Game Loop Patterns](https://gameprogrammingpatterns.com/game-loop.html)

## 🤝 Contributing

We welcome contributions that enhance the educational value of the project!

### Areas for Contribution
- **Educational Content**: Additional Bootstrap concepts and examples
- **Game Mechanics**: New zombie types and turret behaviors
- **Documentation**: Improved explanations and tutorials
- **Accessibility**: Screen reader support and keyboard navigation
- **Performance**: Optimization for smoother gameplay

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with comprehensive documentation
4. Test thoroughly (both educational and technical aspects)
5. Submit a pull request with detailed description

## 🚀 Deployment

The project includes Docker configuration for running the React frontend and Flask backend.

### Local development

1. Build the Docker images and start the stack:
   ```bash
   docker compose up --build
   ```
2. Access the frontend at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:5000](http://localhost:5000).

### Deploying to Render

1. Create a new **Web Service** on Render and point it to the `backend/` directory. Render will build the image from `backend/Dockerfile`.
2. Create a **Static Site** for the React frontend. Set the build command to `npm run build` and the publish directory to `dist`.
3. Configure environment variables such as `FLASK_SECRET_KEY`, `JWT_SECRET_KEY`,
   and `DATABASE_URL` on each service.

### Deploying to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and log in.
2. Use Heroku's container registry to deploy the backend:
   ```bash
   heroku container:push web -a your-backend-app -R backend
   heroku container:release web -a your-backend-app
   ```
3. For the frontend, create a separate app using the Node buildpack. Set `heroku-postbuild` to `npm run build` and serve the static files with a simple server such as `serve` or `vite preview`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bootstrap Team** - For creating an amazing CSS framework
- **React Community** - For the powerful component library
- **Educators** - Who inspired the gamification of web development learning
- **Students** - Whose curiosity drives innovation in education

---

**Ready to defend against the zombie apocalypse while mastering Bootstrap? Let the battle begin!** 🧟‍♂️⚔️
