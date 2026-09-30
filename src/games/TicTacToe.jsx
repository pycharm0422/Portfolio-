import { useEffect, useState } from 'react';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b) {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line: [a, c, d] };
  }
  return b.every(Boolean) ? { player: 'draw', line: [] } : null;
}

// Minimax: O is the computer (maximising), X is the human.
function minimax(b, isO, depth = 0) {
  const w = winnerOf(b);
  if (w) return w.player === 'O' ? 10 - depth : w.player === 'X' ? depth - 10 : 0;
  let best = isO ? -Infinity : Infinity;
  b.forEach((v, i) => {
    if (v) return;
    b[i] = isO ? 'O' : 'X';
    const score = minimax(b, !isO, depth + 1);
    b[i] = null;
    best = isO ? Math.max(best, score) : Math.min(best, score);
  });
  return best;
}

function cpuMove(b, level) {
  const empty = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  if (level === 'easy' && Math.random() < 0.6) return empty[Math.floor(Math.random() * empty.length)];
  let bestScore = -Infinity;
  let move = empty[0];
  for (const i of empty) {
    const copy = [...b];
    copy[i] = 'O';
    const s = minimax(copy, false);
    if (s > bestScore) {
      bestScore = s;
      move = i;
    }
  }
  return move;
}

const MODES = [
  { id: 'hard', label: 'vs CPU (Hard)' },
  { id: 'easy', label: 'vs CPU (Easy)' },
  { id: 'pvp', label: '2 Players' },
];

export default function TicTacToe() {
  const [mode, setMode] = useState('hard');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const [tally, setTally] = useState({ X: 0, O: 0, draw: 0 });
  const result = winnerOf(board);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXNext(true);
  };

  const play = (i) => {
    if (board[i] || result) return;
    if (mode !== 'pvp' && !xNext) return;
    const next = [...board];
    next[i] = xNext ? 'X' : 'O';
    setBoard(next);
    setXNext(!xNext);
  };

  // Computer turn
  useEffect(() => {
    if (mode === 'pvp' || xNext || result) return;
    const id = setTimeout(() => {
      const next = [...board];
      next[cpuMove(board, mode)] = 'O';
      setBoard(next);
      setXNext(true);
    }, 350);
    return () => clearTimeout(id);
  }, [board, xNext, mode, result]);

  useEffect(() => {
    if (result) setTally((t) => ({ ...t, [result.player]: t[result.player] + 1 }));
  }, [result?.player]); // eslint-disable-line react-hooks/exhaustive-deps

  const oName = mode === 'pvp' ? 'O' : 'CPU';
  const status = result
    ? result.player === 'draw'
      ? "It's a draw!"
      : `${result.player === 'O' ? oName : 'X'} wins!`
    : `${xNext ? 'X' : oName}'s turn`;

  return (
    <div className="game ttt">
      <div className="segmented">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? 'active' : ''}
            onClick={() => {
              setMode(m.id);
              setTally({ X: 0, O: 0, draw: 0 });
              reset();
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="scoreboard">
        <span>X <strong>{tally.X}</strong></span>
        <span>Draws <strong>{tally.draw}</strong></span>
        <span>{oName} <strong>{tally.O}</strong></span>
      </div>
      <p className="game-status">{status}</p>
      <div className="ttt-board">
        {board.map((v, i) => (
          <button
            key={i}
            className={`ttt-cell ${v ? v.toLowerCase() : ''} ${result?.line.includes(i) ? 'win' : ''}`}
            onClick={() => play(i)}
            aria-label={`Cell ${i + 1}`}
          >
            {v}
          </button>
        ))}
      </div>
      <button className="btn" onClick={reset}>New round</button>
    </div>
  );
}
