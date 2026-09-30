import Section from './Section.jsx';

export default function About({ profile }) {
  const paragraphs = Array.isArray(profile.about) ? profile.about : [profile.about];
  return (
    <Section id="about" title="About me" kicker="01">
      <div className="about">
        <div className="about-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <ul className="about-facts card">
          {profile.location && (
            <li><span>Location</span>{profile.location}</li>
          )}
          {profile.email && (
            <li><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
          )}
          {profile.title && (
            <li><span>Role</span>{profile.title}</li>
          )}
        </ul>
      </div>
    </Section>
  );
}
