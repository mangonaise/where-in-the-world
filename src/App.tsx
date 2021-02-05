import React, { createContext } from 'react';
import './App.css';
import GameDisplay from './components/GameDisplay';
import SignInButton from './components/SignInButton';
import Game from './logic/game';

const game = new Game();
export const GameContext = createContext<Game>({} as Game);

function App() {
  return (
    <div>
      <SignInButton />
      <h1 id="main-header">
        <span className="title-a">where</span>
        <span className="title-b">in</span>
        <span className="title-c">the</span>
        <span className="title-d">world</span>
      </h1>
      <GameContext.Provider value={game}>
        <GameDisplay/>
      </GameContext.Provider>
    </div>
  );
}

export default App;
