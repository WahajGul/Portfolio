import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '../shared/SectionTitle.jsx'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    role: 'Senior Full-Stack Developer',
    company: 'Tech Corp',
    period: '2024 - Present',
    description:
      'Leading development of microservices architecture serving 1M+ users. Improved API response times by 40% through caching and query optimization.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'StartupXYZ',
    period: '2022 - 2024',
    description:
      'Built and shipped 3 major products from concept to production. Managed CI/CD pipelines and mentored junior developers.',
  },
  {
    role: 'Frontend Developer',
    company: 'WebAgency',
    period: '2021 - 2022',
    description:
      'Developed responsive web applications for diverse clients. Integrated third-party APIs and implemented real-time features.',
  },
]

export default function Experience() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { height: 0 },
        {
          height: '100%',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none none',
          },
        }
      )

      itemsRef.current.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef}>
      <div className="container">
      <SectionTitle subtitle="Career" title="Work Experience" />
      <div className="timeline">
        <div ref={lineRef} className="timeline-line" />
        {experiences.map((exp, index) => (
          <div
            key={exp.period + exp.company}
            ref={(el) => (itemsRef.current[index] = el)}
            className="timeline-item"
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <p className="timeline-period">{exp.period}</p>
              <h3 className="timeline-role">{exp.role}</h3>
              <p className="timeline-company">{exp.company}</p>
              <p className="timeline-desc">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>

      <style>{`
        .timeline {
          position: relative;
          max-width: 700px;
          margin: 0 auto;
        }
        .timeline-line {
          position: absolute;
          left: 20px;
          top: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--accent), transparent);
          border-radius: 1px;
        }
        .timeline-item {
          position: relative;
          padding-left: 56px;
          padding-bottom: 48px;
        }
        .timeline-dot {
          position: absolute;
          left: 14px;
          top: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 0 2px var(--accent);
        }
        .timeline-content {
          background: var(--bg-card);
          border-radius: var(--radius);
          padding: 24px;
          border: 1px solid var(--border);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .timeline-content:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(167, 139, 250, 0.12);
        }
        .timeline-period {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .timeline-role {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .timeline-company {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .timeline-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
      `}</style>
    </section>
  )
}
