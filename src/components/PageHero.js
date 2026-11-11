import HeroArt from "./HeroArt";

const TAG = { mentor: "Mentor lomba", lomba: "Info lomba", market: "Marketplace" };

export default function PageHero({ theme, title, sub, children }) {
  return (
    <section className="phero">
      <HeroArt theme={theme} />
      <div className="phero-shade" aria-hidden="true" />
      <div className="container">
        <div className="phero-top">
          <div className="phero-text">
            <span className="lp-tag">{TAG[theme]}</span>
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
        </div>
        <div className="phero-controls">{children}</div>
      </div>
    </section>
  );
}