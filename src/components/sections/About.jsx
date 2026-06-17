import { useRef } from 'react'
import useScrollAnimations from '../../hooks/useScrollAnimations.js'
import SectionTitle from '../shared/SectionTitle.jsx'

export default function About() {
  const sectionRef = useRef(null)
  useScrollAnimations(sectionRef)

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
      <SectionTitle subtitle="About Me" title="Who I Am" />
      <div className="about-card">
        <div className="about-glow" />
        <p>
          I'm a full-stack developer with a passion for building products that
          make a real difference. I specialize in crafting clean, performant
          applications using modern JavaScript frameworks and scalable backend
          architectures.
        </p>
        <p>
          My expertise spans the entire development stack — from designing
          responsive, intuitive frontends with React and Next.js to building
          robust APIs and managing databases with Node.js, PostgreSQL, and
          MongoDB. I'm always exploring new tools and technologies to deliver
          the best possible solutions.
        </p>
        <p>
          When I'm not coding, you'll find me diving into system design,
          contributing to open source projects, or sharing what I've learned
          through technical writing.
        </p>

        <div className="about-stats">
          <div className="about-stat">
            <span className="about-stat-value">3+</span>
            <span className="about-stat-label">Years Experience</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-value">20+</span>
            <span className="about-stat-label">Projects Built</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-value">10+</span>
            <span className="about-stat-label">Technologies</span>
          </div>
        </div>
      </div>
      </div>

      <style>{`
        .about-card {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.8;
          background: var(--bg-card);
          border-radius: var(--radius);
          padding: 40px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .about-glow {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .about-stats {
          display: flex;
          gap: 32px;
          margin-top: 12px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .about-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .about-stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent);
        }
        .about-stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 600px) {
          .about-card { padding: 24px; }
          .about-stats { flex-direction: column; gap: 16px; }
        }
      `}</style>
    </section>
  )
}
