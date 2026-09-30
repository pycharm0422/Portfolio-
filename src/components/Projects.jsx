import Section from './Section.jsx';
import { asset } from '../utils.js';

export default function Projects({ items }) {
  return (
    <Section id="projects" title="Projects" kicker="05">
      <div className="grid-3">
        {items.map((p) => (
          <article key={p.title} className="card project">
            {p.image ? (
              <img className="project-img" src={asset(p.image)} alt={p.title} />
            ) : (
              <div className="project-img placeholder">{p.title.slice(0, 1)}</div>
            )}
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.tech?.length > 0 && (
              <div className="tags">
                {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
            <div className="project-links">
              {p.github && <a href={p.github} target="_blank" rel="noreferrer">Code ↗</a>}
              {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
