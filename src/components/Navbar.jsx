import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../utils.js';

export default function Navbar({ name, links }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [theme, setTheme] = useState(() => storageGet('theme', null));

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const current =
      theme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    storageSet('theme', next);
  };

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">{initials}</span>
          <span className="brand-name">{name}</span>
        </a>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            ◐
          </button>
          <button
            className="icon-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}
