import Section from './Section.jsx';

export default function Expertise({ groups }) {
  return (
    <Section id="expertise" title="Expertise" kicker="04">
      <div className="grid-3">
        {groups.map((g) => (
          <div key={g.category} className="card">
            <h3>{g.category}</h3>
            <ul className="skills">
              {g.skills.map((s) => {
                const skill = typeof s === 'string' ? { name: s } : s;
                return (
                  <li key={skill.name}>
                    <div className="skill-row">
                      <span>{skill.name}</span>
                      {skill.level != null && <span className="muted small">{skill.level}%</span>}
                    </div>
                    {skill.level != null && (
                      <div className="bar"><div style={{ width: `${skill.level}%` }} /></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
