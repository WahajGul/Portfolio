import { useRef } from 'react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import useScrollAnimations from '../../hooks/useScrollAnimations.js'
import SectionTitle from '../shared/SectionTitle.jsx'
import Button from '../shared/Button.jsx'
import { PiGithubLogoBold, PiArrowSquareOutBold } from 'react-icons/pi'

export default function Projects() {
  const { projects } = usePortfolio()
  const sectionRef = useRef(null)
  useScrollAnimations(sectionRef)

  return (
    <section id="projects" ref={sectionRef}>
      <div className="container">
      <SectionTitle subtitle="Portfolio" title="Featured Projects" />
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card-accent" />
            <div className="project-card-inner">
              <div className="project-icon">
                <PiArrowSquareOutBold size={22} />
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <Button variant="outline" href={project.demoLink} icon={PiArrowSquareOutBold}>
                  Demo
                </Button>
                <Button variant="outline" href={project.repoLink} icon={PiGithubLogoBold}>
                  Code
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .project-card {
          background: var(--bg-card);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(167, 139, 250, 0.12);
        }
        .project-card-accent {
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-warm));
        }
        .project-card-inner {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        .project-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-glow);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .project-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .project-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 20px;
          flex: 1;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tech-tag {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--accent-glow);
          color: var(--accent);
          border: 1px solid rgba(167, 139, 250, 0.2);
        }
        .project-links {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </section>
  )
}
