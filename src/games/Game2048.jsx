import { useCallback, useEffect, useRef, useState } from 'react';
import { storageGet, storageSet } from '../utils.js';

const N = 4;

function addTile(grid) {
  const empty = [];
  grid.forEach((row, r) => row.forEach((v, c) => !v && empty.push([r, c])));
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function fresh() {
  return addTile(addTile(Array.from({ length: N }, () => Array(N).fill(0))));
}

// Slide one row to the left, merging equal neighbours once.
function slideRow(row) {
  const vals = row.filter(Boolean);
  const out = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2);
      gained += vals[i] * 2;
      i++;
    } else {
      out.push(vals[i]);
    }
  }
  while (out.length < N) out.push(0);
  return { row: out, gained };
}

const transpose = (g) => g[0].map((_, c) => g.map((row) => row[c]));
const reverse = (g) => g.map((row) => [...row].reverse());

function move(grid, dir) {
  let g = grid;
  if (dir === 'up' || dir === 'down') g = transpose(g);
  if (dir === 'right' || dir === 'down') g = reverse(g);
  let gained = 0;
  g = g.map((row) => {
    const res = slideRow(row);
    gained += res.gained;
    return res.row;
  });
  if (dir === 'right' || dir === 'down') g = reverse(g);
  if (dir === 'up' || dir === 'down') g = transpose(g);
  const changed = g.some((row, r) => row.some((v, c) => v !== grid[r][c]));
  return { grid: g, gained, changed };
}

const canMove = (g) => ['left', 'right', 'up', 'down'].some((d) => move(g, d).changed);

const KEYS = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down',
};

export default function Game2048() {
  const [grid, setGrid] = useState(fresh);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => storageGet('2048-best', 0));
  const [keepGoing, setKeepGoing] = useState(false);
  const boardRef = useRef(null);
  const touch = useRef(null);

  const over = !canMove(grid);
  const won = !keepGoing && grid.some((row) => row.some((v) => v >= 2048));

  const doMove = useCallback(
    (dir) => {
      if (over || won) return;
      const res = move(grid, dir);
      if (!res.changed) return;
      setGrid(addTile(res.grid));
      setScore((s) => s + res.gained);
    },
    [grid, over, won]
  );

  useEffect(() => {
    if (score > best) {
      setBest(score);
      storageSet('2048-best', score);
    }
  }, [score, best]);

  useEffect(() => {
    boardRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e) => {
    const dir = KEYS[e.key];
    if (!dir) return;
    e.preventDefault();
    doMove(dir);
  };

  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
    doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };

  const restart = () => {
    setGrid(fresh());
    setScore(0);
    setKeepGoing(false);
    boardRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="game g2048">
      <div className="scoreboard">
        <span>Score <strong>{score}</strong></span>
        <span>Best <strong>{best}</strong></span>
      </div>
      <div className="board-wrap">
        <div
          ref={boardRef}
          className="g2048-board"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label="2048 board. Use arrow keys to move tiles."
        >
          {grid.flat().map((v, i) => (
            <div key={i} className={`tile v${v > 2048 ? 'big' : v}`}>{v || ''}</div>
          ))}
        </div>
        {(over || won) && (
          <div className="overlay">
            <p className="overlay-title">{won ? 'You reached 2048! 🎉' : 'No moves left'}</p>
            {won && <button className="btn" onClick={() => setKeepGoing(true)}>Keep going</button>}
            <button className="btn primary" onClick={restart}>New game</button>
          </div>
        )}
      </div>
      <p className="muted small">Click the board, then use arrow keys / WASD. Swipe on mobile.</p>
      <button className="btn" onClick={restart}>New game</button>
    </div>
  );
}
