import Section from './Section.jsx';

export default function Contact({ profile, contact }) {
  return (
    <Section id="contact" title={contact?.heading || 'Get in touch'} kicker="08">
      <div className="contact card">
        <p>{contact?.message}</p>
        {profile.email && (
          <a className="btn primary" href={`mailto:${profile.email}`}>Say hello ✉️</a>
        )}
        {profile.socials?.length > 0 && (
          <div className="socials center">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
