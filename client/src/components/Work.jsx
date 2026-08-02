import { ArrowRightIcon } from './Icons.jsx';
import { projects } from '../data/site.js';
import './Work.css';

export default function Work({ onOpen }) {
  return (
    <section id="work" className="section work">
      <div className="panel panel--wine">
        <header className="section-head" data-reveal>
          <span className="eyebrow">selected work</span>
          <h2 className="section-title">
            Stuff I&rsquo;ve <em>built &amp; shipped</em>.
          </h2>
          <p className="section-lead">
            Each one started as a problem, became a product, and got a marketing push. Open any
            card for the full story.
          </p>
        </header>

        <div className="work-grid" data-reveal>
          {projects.map((p) => (
            <article className="work-card patch" key={p.id}>
              {p.wip && <span className="wip-ribbon">🚧 In build</span>}
              <button
                type="button"
                className="work-hit"
                onClick={() => onOpen(p.id)}
                aria-label={`Read the story behind ${p.title}`}
              >
                <span className="work-img">
                  <img src={p.image} alt="" loading="lazy" />
                  <span className="work-cat">{p.tag}</span>
                </span>
                <span className="work-body">
                  <span className="work-title">{p.title}</span>
                  <span className="work-blurb">{p.blurb}</span>
                  <span className="work-more">
                    {p.wip ? 'Sneak a peek' : 'Read the story'}{' '}
                    <ArrowRightIcon width={16} height={16} />
                  </span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
