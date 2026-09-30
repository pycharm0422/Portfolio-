import { asset } from '../utils.js';

export default function Hero({ profile }) {
  return (
    <header id="top" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="kicker">Hello, I'm</span>
          <h1>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn primary">View my work</a>
            <a href="#games" className="btn">Play a game 🎮</a>
            {profile.resume && (
              <a href={asset(profile.resume)} className="btn" target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>
          {profile.socials?.length > 0 && (
            <div className="socials">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {profile.photo && (
          <div className="hero-photo">
            <img src={asset(profile.photo)} alt={profile.name} />
          </div>
        )}
      </div>
    </header>
  );
}
