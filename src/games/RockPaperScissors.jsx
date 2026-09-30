import { useState } from 'react';

const CHOICES = [
  { id: 'rock', emoji: '✊', beats: 'scissors' },
  { id: 'paper', emoji: '✋', beats: 'rock' },
  { id: 'scissors', emoji: '✌️', beats: 'paper' },
];

export default function RockPaperScissors() {
  const [score, setScore] = useState({ you: 0, cpu: 0 });
  const [round, setRound] = useState(null);

  const play = (choice) => {
    const cpu = CHOICES[Math.floor(Math.random() * 3)];
    const outcome = choice.id === cpu.id ? 'draw' : choice.beats === cpu.id ? 'win' : 'lose';
    setRound({ you: choice, cpu, outcome });
    if (outcome === 'win') setScore((s) => ({ ...s, you: s.you + 1 }));
    if (outcome === 'lose') setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
  };

  const text = { win: 'You win! 🎉', lose: 'CPU wins 😢', draw: "It's a draw 🤝" };

  return (
    <div className="game rps">
      <div className="scoreboard">
        <span>You <strong>{score.you}</strong></span>
        <span>CPU <strong>{score.cpu}</strong></span>
      </div>
      <div className="rps-arena">
        <div className="rps-hand">
          <span>{round?.you.emoji ?? '❔'}</span>
          <small>You</small>
        </div>
        <span className="muted">vs</span>
        <div className="rps-hand">
          <span>{round?.cpu.emoji ?? '❔'}</span>
          <small>CPU</small>
        </div>
      </div>
      <p className={`game-status ${round?.outcome ?? ''}`}>{round ? text[round.outcome] : 'Pick your move'}</p>
      <div className="rps-choices">
        {CHOICES.map((c) => (
          <button key={c.id} className="rps-btn" onClick={() => play(c)} aria-label={c.id}>
            <span>{c.emoji}</span>
            <small>{c.id}</small>
          </button>
        ))}
      </div>
      <button className="btn" onClick={() => { setScore({ you: 0, cpu: 0 }); setRound(null); }}>
        Reset score
      </button>
    </div>
  );
}
