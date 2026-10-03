import Section from './Section.jsx';

// Skills can be plain strings ("Java") shown as chips, or objects with a
// level ({ "name": "Java", "level": 80 }) shown as progress bars.
export default function Expertise({ groups }) {
  return (
    <Section id="expertise" title="Expertise" kicker="04">
      <div className="grid-3">
        {groups.map((g) => {
          const skills = g.skills.map((s) => (typeof s === 'string' ? { name: s } : s));
          const withBars = skills.some((s) => s.level != null);
          return (
            <div key={g.category} className="card">
              <h3>{g.category}</h3>
              {withBars ? (
                <ul className="skills">
                  {skills.map((s) => (
                    <li key={s.name}>
                      <div className="skill-row">
                        <span>{s.name}</span>
                        {s.level != null && <span className="muted small">{s.level}%</span>}
                      </div>
                      {s.level != null && (
                        <div className="bar"><div style={{ width: `${s.level}%` }} /></div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="tags skill-chips">
                  {skills.map((s) => <span key={s.name} className="tag">{s.name}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
