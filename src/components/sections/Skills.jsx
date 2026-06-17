import { useRef } from 'react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import useScrollAnimations from '../../hooks/useScrollAnimations.js'
import SectionTitle from '../shared/SectionTitle.jsx'
import { FaReact, FaNodeJs, FaDocker } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiPostgresql, SiMongodb, SiGraphql } from 'react-icons/si'

const iconMap = {
  React: FaReact,
  'Node.js': FaNodeJs,
  TypeScript: SiTypescript,
  'Next.js': SiNextdotjs,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Docker: FaDocker,
  GraphQL: SiGraphql,
}

function getGradient(name) {
  const gradients = {
    React: 'linear-gradient(135deg, #61dafb, #2c8eb5)',
    'Node.js': 'linear-gradient(135deg, #84cc16, #22c55e)',
    TypeScript: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    'Next.js': 'linear-gradient(135deg, #a1a1aa, #fafafa)',
    PostgreSQL: 'linear-gradient(135deg, #60a5fa, #1d4ed8)',
    MongoDB: 'linear-gradient(135deg, #4ade80, #16a34a)',
    Docker: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    GraphQL: 'linear-gradient(135deg, #e879f9, #d946ef)',
  }
  return gradients[name] || 'linear-gradient(135deg, #a78bfa, #fb923c)'
}

export default function Skills() {
  const { skills } = usePortfolio()
  const sectionRef = useRef(null)
  useScrollAnimations(sectionRef)

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
      <SectionTitle subtitle="Expertise" title="Skills & Technologies" />
      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.name} className="skill-card">
            <div className="skill-card-accent" style={{ background: getGradient(skill.name) }} />
            <div className="skill-card-inner">
              <div
                className="skill-icon-wrap"
                style={{ background: getGradient(skill.name) }}
              >
                {(() => {
                  const Icon = iconMap[skill.name] || FaReact
                  return <Icon size={24} className="skill-icon-svg" />
                })()}
              </div>
              <h3 className="skill-name">{skill.name}</h3>
            </div>
          </div>
        ))}
      </div>
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }
        .skill-card {
          background: var(--bg-card);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          cursor: default;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .skill-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(167, 139, 250, 0.12);
        }
        .skill-card-accent {
          height: 3px;
          width: 100%;
        }
        .skill-card-inner {
          padding: 28px 20px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .skill-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .skill-icon-svg {
          color: #fff;
        }
        .skill-name {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}
