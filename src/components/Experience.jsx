import Section from './Section.jsx';

export default function Experience({ items }) {
  return (
    <Section id="experience" title="Experience" kicker="03">
      <div className="timeline">
        {items.map((x, i) => (
          <article key={i} className="timeline-item card">
            <div className="timeline-meta">
              <span className="date">{x.start} — {x.end}</span>
              {x.location && <span className="muted small">{x.location}</span>}
            </div>
            <h3>
              {x.role} <span className="accent">@ {x.company}</span>
            </h3>
            {x.description && <p>{x.description}</p>}
            {x.highlights?.length > 0 && (
              <ul className="bullets">
                {x.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
            {x.tech?.length > 0 && (
              <div className="tags">
                {x.tech.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
