import data from './data/portfolio.json';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Expertise from './components/Expertise.jsx';
import Projects from './components/Projects.jsx';
import Games from './components/Games.jsx';
import Extras from './components/Extras.jsx';
import Contact from './components/Contact.jsx';

const has = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));

export default function App() {
  const { profile, education, experience, expertise, projects, games, extras, contact } = data;

  // A section only appears (in the page and the nav) when it has data in the JSON.
  const sections = [
    { id: 'about', label: 'About', show: has(profile?.about), el: <About profile={profile} /> },
    { id: 'education', label: 'Education', show: has(education), el: <Education items={education} /> },
    { id: 'experience', label: 'Experience', show: has(experience), el: <Experience items={experience} /> },
    { id: 'expertise', label: 'Expertise', show: has(expertise), el: <Expertise groups={expertise} /> },
    { id: 'projects', label: 'Projects', show: has(projects), el: <Projects items={projects} /> },
    { id: 'games', label: 'Games', show: has(games?.list), el: <Games config={games} /> },
    { id: 'extras', label: 'Extras', show: has(extras), el: <Extras items={extras} /> },
    { id: 'contact', label: 'Contact', show: true, el: <Contact profile={profile} contact={contact} /> },
  ].filter((s) => s.show);

  return (
    <>
      <Navbar name={profile.name} links={sections.map(({ id, label }) => ({ id, label }))} />
      <main>
        <Hero profile={profile} />
        {sections.map((s) => (
          <div key={s.id}>{s.el}</div>
        ))}
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} · Built with React
      </footer>
    </>
  );
}
