import { useState } from 'react';
import Section from './Section.jsx';
import Snake from '../games/Snake.jsx';
import TicTacToe from '../games/TicTacToe.jsx';
import Memory from '../games/Memory.jsx';
import Game2048 from '../games/Game2048.jsx';
import RockPaperScissors from '../games/RockPaperScissors.jsx';
import WhackAMole from '../games/WhackAMole.jsx';

// Maps the "id" used in portfolio.json to the game component.
const GAMES = {
  snake: Snake,
  tictactoe: TicTacToe,
  memory: Memory,
  2048: Game2048,
  rps: RockPaperScissors,
  whack: WhackAMole,
};

export default function Games({ config }) {
  const list = config.list.filter((g) => GAMES[g.id] && g.enabled !== false);
  const [current, setCurrent] = useState(list[0]?.id);
  const game = list.find((g) => g.id === current);
  const Active = game && GAMES[game.id];

  return (
    <Section id="games" title="Game zone" kicker="06">
      {config.intro && <p className="section-intro">{config.intro}</p>}
      <div className="game-tabs" role="tablist">
        {list.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === current}
            className={`game-tab ${g.id === current ? 'active' : ''}`}
            onClick={() => setCurrent(g.id)}
          >
            <span className="game-emoji">{g.emoji}</span>
            {g.title}
          </button>
        ))}
      </div>
      {Active && (
        <div className="card game-stage">
          <div className="game-info">
            <h3>{game.emoji} {game.title}</h3>
            <p className="muted">{game.description}</p>
          </div>
          <Active key={game.id} />
        </div>
      )}
    </Section>
  );
}
