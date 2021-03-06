import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import './Leaderboard.css';
import { GameContext, SetScreenContext } from '../../App';
import LeaderboardHandler from '../../logic/leaderboard handler';
import { auth } from '../../logic/firebase';


const Leaderboard: React.FC = () => {
  const game = useContext(GameContext);
  const setScreen = useContext(SetScreenContext);
  const [handler, setHandler] = useState<LeaderboardHandler>();

  function newGame() {
    game.initialize();
    setScreen('game');
  }


  useEffect(() => {
    setHandler(new LeaderboardHandler(game.score));
  }, [])

  if (handler?.isWaitingForData) return null;

  return (
    <div id="leaderboard-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {handler?.previousBest && 
          <div id="new-best-text">
            {handler.previousBest < game.score ? 'New personal best!' : `Personal best: ${handler.previousBest}`}
          </div>}
        <div>Your global ranking:</div>
        <div id="user-ranking">{handler?.userRanking}</div>
        <div style={{ color: 'gray' }}>(out of {handler?.worstPossibleRanking})</div>
        <div id="leaderboard-header">Hall of Fame</div>
        <div id="leaderboard">
          {handler?.topScoresData.map((data, index) => (
            <div 
              className={"leaderboard-listing " + (data.uid === auth().currentUser?.uid ? 'user-leaderboard-listing' : '')} 
              key={index}>
              <div className="leaderboard-number">#{index + 1}</div>
              <div className="leaderboard-name">{data.name}</div>
              <div className="leaderboard-score">{data.score}</div>
            </div>
          ))}
        </div>
        <button className="start-game-button" onClick={newGame}>Play again</button>
      </div>
    </div>
  )
}

export default observer(Leaderboard);