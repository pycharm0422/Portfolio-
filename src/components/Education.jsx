import Section from './Section.jsx';

export default function Education({ items }) {
  return (
    <Section id="education" title="Education" kicker="02">
      <div className="timeline">
        {items.map((e, i) => (
          <article key={i} className="timeline-item card">
            <div className="timeline-meta">
              <span className="date">{e.start} — {e.end}</span>
              {e.grade && <span className="pill">{e.grade}</span>}
            </div>
            <h3>{e.degree}</h3>
            <p className="muted">
              {e.institution}{e.location ? ` · ${e.location}` : ''}
            </p>
            {e.highlights?.length > 0 && (
              <ul className="bullets">
                {e.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
