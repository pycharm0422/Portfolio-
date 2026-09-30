import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../utils.js';

const HOLES = 9;
const DURATION = 30;

export default function WhackAMole() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [mole, setMole] = useState(null);
  const [score, setScore] = useState(0);
  const [hit, setHit] = useState(null);
  const [best, setBest] = useState(() => storageGet('whack-best', 0));

  // Countdown
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setMole(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft]);

  // Moles pop up faster as time runs out
  useEffect(() => {
    if (!running) return;
    const delay = 450 + (timeLeft / DURATION) * 450;
    const id = setTimeout(() => {
      let next;
      do next = Math.floor(Math.random() * HOLES);
      while (next === mole);
      setMole(next);
    }, delay);
    return () => clearTimeout(id);
  }, [running, mole, timeLeft]);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      storageSet('whack-best', score);
    }
  }, [score, best]);

  const whack = (i) => {
    if (!running || i !== mole) return;
    setScore((s) => s + 1);
    setHit(i);
    setMole(null);
    setTimeout(() => setHit(null), 200);
  };

  const start = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setMole(null);
    setRunning(true);
  };

  return (
    <div className="game whack">
      <div className="scoreboard">
        <span>Score <strong>{score}</strong></span>
        <span>Time <strong>{timeLeft}s</strong></span>
        <span>Best <strong>{best}</strong></span>
      </div>
      <div className="whack-grid">
        {Array.from({ length: HOLES }, (_, i) => (
          <button key={i} className={`hole ${hit === i ? 'hit' : ''}`} onClick={() => whack(i)} aria-label={`Hole ${i + 1}`}>
            <span className={`mole ${mole === i ? 'up' : ''}`}>🐹</span>
          </button>
        ))}
      </div>
      {!running && (
        <button className="btn primary" onClick={start}>
          {timeLeft === 0 ? `Play again (scored ${score})` : 'Start'}
        </button>
      )}
    </div>
  );
}
