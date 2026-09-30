import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../utils.js';

const EMOJIS = ['⚽', '🏆', '🎮', '💻', '🚀', '🍕', '🎧', '🐍'];

function deal() {
  return [...EMOJIS, ...EMOJIS]
    .map((e) => ({ e, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((c, id) => ({ id, emoji: c.e, matched: false }));
}

export default function Memory() {
  const [cards, setCards] = useState(deal);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => storageGet('memory-best', null));
  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const match = cards[a].emoji === cards[b].emoji;
    const id = setTimeout(
      () => {
        if (match) setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setFlipped([]);
      },
      match ? 300 : 800
    );
    return () => clearTimeout(id);
  }, [flipped, cards]);

  useEffect(() => {
    if (won && (best === null || moves < best)) {
      setBest(moves);
      storageSet('memory-best', moves);
    }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const flip = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || cards[i].matched) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  const restart = () => {
    setCards(deal());
    setFlipped([]);
    setMoves(0);
  };

  return (
    <div className="game memory">
      <div className="scoreboard">
        <span>Moves <strong>{moves}</strong></span>
        <span>Best <strong>{best ?? '—'}</strong></span>
      </div>
      {won && <p className="game-status">🎉 You found all pairs in {moves} moves!</p>}
      <div className="memory-grid">
        {cards.map((c, i) => {
          const open = c.matched || flipped.includes(i);
          return (
            <button
              key={c.id}
              className={`memory-card ${open ? 'open' : ''} ${c.matched ? 'matched' : ''}`}
              onClick={() => flip(i)}
              aria-label={open ? c.emoji : 'Hidden card'}
            >
              <span className="memory-inner">
                <span className="memory-front">?</span>
                <span className="memory-back">{c.emoji}</span>
              </span>
            </button>
          );
        })}
      </div>
      <button className="btn" onClick={restart}>Shuffle & restart</button>
    </div>
  );
}
