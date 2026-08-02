import { useEffect } from 'react';

import { CloseIcon } from './Icons.jsx';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    document.body.classList.add('is-locked');
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={project.title}>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close" />
      <article className="modal-card on-dark">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon width={20} height={20} />
        </button>

        <figure className="modal-media">
          <img src={project.image} alt="" />
        </figure>

        <div className="modal-body">
          <p className="modal-tag">{project.tag}</p>
          <h3 className="modal-title">{project.title}</h3>

          <div className="modal-block">
            <h4>The problem</h4>
            <p>{project.problem}</p>
          </div>
          <div className="modal-block">
            <h4>What I built</h4>
            <p>{project.build}</p>
          </div>
          <div className="modal-block">
            <h4>The result</h4>
            <p>{project.result}</p>
          </div>

          <ul className="modal-stack">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
