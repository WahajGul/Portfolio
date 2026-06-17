import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loading({ onComplete }) {
  const barRef = useRef(null)
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete,
    })

    tl.to(barRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power3.inOut',
    })
      .to(
        textRef.current,
        { opacity: 0, y: -10, duration: 0.3 },
        '-=0.3'
      )
      .to(
        glowRef.current,
        { opacity: 0, duration: 0.5 },
        '-=0.5'
      )
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
  }, [onComplete])

  return (
    <div ref={containerRef} className="loading-screen">
      <div ref={glowRef} className="loading-glow" />
      <div className="loading-content">
        <p ref={textRef} className="loading-text">
          Loading...
        </p>
        <div className="loading-bar">
          <div ref={barRef} className="loading-bar-fill" />
        </div>
      </div>

      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }
        .loading-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
        }
        .loading-text {
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: monospace;
        }
        .loading-bar {
          width: 220px;
          height: 3px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .loading-bar-fill {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #a78bfa, #fb923c);
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}
