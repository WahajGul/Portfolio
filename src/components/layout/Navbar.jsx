import { useState, useEffect } from 'react'
import { PiListBold, PiXBold } from 'react-icons/pi'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="#home" className="navbar-logo">
          <span className="navbar-logo-text">WG</span>
        </a>

        <div className="navbar-desktop">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="navbar-toggle"
          aria-label="Toggle menu"
        >
          {open ? <PiXBold size={22} /> : <PiListBold size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="navbar-mobile-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 24px;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(7, 7, 13, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          text-decoration: none;
        }
        .navbar-logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar-desktop {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .navbar-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }
        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: width 0.3s ease;
          border-radius: 1px;
        }
        .navbar-link:hover {
          color: var(--text-primary);
        }
        .navbar-link:hover::after {
          width: 100%;
        }
        .navbar-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
        }
        .navbar-mobile {
          display: none;
          flex-direction: column;
          gap: 12px;
          padding: 16px 0 8px;
        }
        .navbar-mobile-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 8px 0;
          transition: color 0.3s;
        }
        .navbar-mobile-link:hover {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .navbar-desktop { display: none !important; }
          .navbar-toggle { display: flex !important; }
          .navbar-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
