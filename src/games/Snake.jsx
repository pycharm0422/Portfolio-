import { useCallback, useEffect, useRef, useState } from 'react';
import { storageGet, storageSet } from '../utils.js';

const GRID = 20;
const CELL = 20;
const DIRS = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
};

function randomFood(snake) {
  while (true) {
    const f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some((p) => p.x === f.x && p.y === f.y)) return f;
  }
}

function newGame() {
  const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  return { snake, dir: { x: 1, y: 0 }, queue: [], food: randomFood(snake) };
}

export default function Snake() {
  const canvasRef = useRef(null);
  const game = useRef(newGame());
  const touchStart = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | running | paused | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => storageGet('snake-best', 0));

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { snake, food } = game.current;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < GRID; x++)
      for (let y = 0; y < GRID; y++) if ((x + y) % 2 === 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#a3e635' : '#22c55e';
      ctx.beginPath();
      ctx.roundRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2, 5);
      ctx.fill();
    });
  }, []);

  useEffect(draw, [draw]);

  const turn = useCallback((d) => {
    const g = game.current;
    const last = g.queue[g.queue.length - 1] || g.dir;
    if ((d.x === -last.x && d.y === -last.y) || (d.x === last.x && d.y === last.y)) return;
    if (g.queue.length < 3) g.queue.push(d);
  }, []);

  const start = useCallback(() => {
    if (status === 'over' || status === 'idle') {
      game.current = newGame();
      setScore(0);
      draw();
    }
    setStatus('running');
  }, [status, draw]);

  // Game loop — speeds up as the score grows.
  useEffect(() => {
    if (status !== 'running') return;
    const speed = Math.max(55, 120 - score * 3);
    const id = setInterval(() => {
      const g = game.current;
      if (g.queue.length) g.dir = g.queue.shift();
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
      const hitSelf = g.snake.slice(0, -1).some((p) => p.x === head.x && p.y === head.y);
      if (hitWall || hitSelf) {
        setStatus('over');
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        g.food = randomFood(g.snake);
        setScore((s) => s + 1);
      } else {
        g.snake.pop();
      }
      draw();
    }, speed);
    return () => clearInterval(id);
  }, [status, score, draw]);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      storageSet('snake-best', score);
    }
  }, [score, best]);

  // Keyboard controls (only swallow keys while the game is active).
  useEffect(() => {
    const onKey = (e) => {
      if (status === 'running' && DIRS[e.key]) {
        e.preventDefault();
        turn(DIRS[e.key]);
      } else if (e.key === ' ' && (status === 'running' || status === 'paused')) {
        e.preventDefault();
        status === 'running' ? setStatus('paused') : start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, turn, start]);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  return (
    <div className="game snake">
      <div className="scoreboard">
        <span>Score <strong>{score}</strong></span>
        <span>Best <strong>{best}</strong></span>
      </div>
      <div className="board-wrap">
        <canvas
          ref={canvasRef}
          width={GRID * CELL}
          height={GRID * CELL}
          className="snake-canvas"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        {status !== 'running' && (
          <div className="overlay">
            {status === 'over' && <p className="overlay-title">Game over — {score} pts</p>}
            {status === 'paused' && <p className="overlay-title">Paused</p>}
            <button className="btn primary" onClick={start}>
              {status === 'paused' ? 'Resume' : status === 'over' ? 'Play again' : 'Start'}
            </button>
            <p className="muted small">Arrows / WASD · Space to pause · Swipe on mobile</p>
          </div>
        )}
      </div>
      <div className="dpad">
        <button onClick={() => turn(DIRS.ArrowUp)} aria-label="Up">▲</button>
        <button onClick={() => turn(DIRS.ArrowLeft)} aria-label="Left">◀</button>
        <button onClick={() => (status === 'running' ? setStatus('paused') : start())} aria-label="Pause">
          {status === 'running' ? '❚❚' : '▶'}
        </button>
        <button onClick={() => turn(DIRS.ArrowRight)} aria-label="Right">▶</button>
        <button onClick={() => turn(DIRS.ArrowDown)} aria-label="Down">▼</button>
      </div>
    </div>
  );
}
