export default function Section({ id, title, kicker, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <header className="section-head">
          {kicker && <span className="kicker">{kicker}</span>}
          <h2>{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
