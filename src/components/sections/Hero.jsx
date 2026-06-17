import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { PiArrowDownBold, PiGithubLogoBold, PiLinkedinLogoBold } from 'react-icons/pi'
import Button from '../shared/Button.jsx'

export default function Hero() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current.children, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      })

      gsap.from(ctaRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section"
    >
      <div className="hero-glow" />
      <div className="hero-glow hero-glow-2" />

      <div className="container">
      <div ref={textRef}>
        <p className="hero-greeting">
          Hi, my name is
        </p>
        <h1 className="hero-name">
          Wahaj Gul
        </h1>
        <p className="hero-tagline">
          Full-stack developer passionate about crafting performant, scalable
          web applications with modern technologies.
        </p>
      </div>

      <div ref={ctaRef} className="hero-cta">
        <Button
          href="#projects"
          icon={PiArrowDownBold}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          View My Work
        </Button>
        <Button variant="outline" href="#contact">
          Get In Touch
        </Button>
        <Button
          variant="outline"
          href="https://github.com/wahajgul"
          icon={PiGithubLogoBold}
        />
        <Button
          variant="outline"
          href="https://linkedin.com/in/wahajgul"
          icon={PiLinkedinLogoBold}
        />
      </div>

      <button
        type="button"
        onClick={scrollDown}
        className="hero-scroll"
        aria-label="Scroll down"
      >
        <PiArrowDownBold size={24} />
      </button>
      </div>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          padding-top: 80px;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          pointer-events: none;
        }
        .hero-glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%);
          bottom: -200px;
          left: -200px;
          top: auto;
          right: auto;
        }
        .hero-greeting {
          font-size: 1rem;
          color: var(--accent);
          margin-bottom: 16px;
          font-weight: 600;
        }
        .hero-name {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #eeeef8 0%, #a78bfa 50%, #fb923c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-tagline {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .hero-cta {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero-scroll {
          position: absolute;
          bottom: 40px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          animation: bounce 2s infinite;
          transition: color 0.3s;
        }
        .hero-scroll:hover {
          color: var(--accent);
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  )
}
