import Section from './Section.jsx';
import { asset } from '../utils.js';

export default function Extras({ items }) {
  return (
    <Section id="extras" title="Extras" kicker="07">
      <div className="extras">
        {items.map((x) => (
          <article key={x.title} className="card extra">
            <div className="extra-text">
              <h3>
                {x.icon && <span className="extra-icon">{x.icon}</span>} {x.title}
              </h3>
              {x.subtitle && <p className="accent">{x.subtitle}</p>}
              {x.description && <p>{x.description}</p>}
              {x.stats?.length > 0 && (
                <div className="stats">
                  {x.stats.map((s) => (
                    <div key={s.label} className="stat">
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {x.highlights?.length > 0 && (
                <ul className="bullets">
                  {x.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
            {x.photos?.length > 0 && (
              <div className={`gallery ${x.photos.length > 1 ? 'multi' : ''}`}>
                {x.photos.map((ph, i) => (
                  <figure key={i}>
                    <img src={asset(ph.src)} alt={ph.caption || x.title} loading="lazy" />
                    {ph.caption && <figcaption>{ph.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
