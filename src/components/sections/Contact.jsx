import { useRef } from 'react'
import gsap from 'gsap'
import useScrollAnimations from '../../hooks/useScrollAnimations.js'
import SectionTitle from '../shared/SectionTitle.jsx'
import Button from '../shared/Button.jsx'
import { PiPaperPlaneTiltBold, PiGithubLogoBold, PiLinkedinLogoBold, PiEnvelopeBold } from 'react-icons/pi'

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  useScrollAnimations(sectionRef)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const tl = gsap.timeline()
    tl.to(form, { scale: 0.98, duration: 0.1 })
      .to(form, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section id="contact" ref={sectionRef}>
      <div className="container">
      <SectionTitle subtitle="Contact" title="Let's Work Together" />
      <div className="contact-inner">
        <p className="contact-text">
          Have a project in mind or just want to chat? Feel free to reach out.
          I'm always open to discussing new opportunities and interesting ideas.
        </p>

        <div className="social-links">
          <a
            href="https://github.com/wahajgul"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <PiGithubLogoBold size={20} />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/wahajgul"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <PiLinkedinLogoBold size={20} />
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:hello@wahajgul.dev"
            className="social-link"
          >
            <PiEnvelopeBold size={20} />
            <span>Email</span>
          </a>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Your Name" required className="form-input" />
            <input type="email" placeholder="Your Email" required className="form-input" />
          </div>
          <input type="text" placeholder="Subject" required className="form-input" />
          <textarea placeholder="Your Message" required rows={5} className="form-input form-textarea" />
          <Button type="submit" icon={PiPaperPlaneTiltBold}>
            Send Message
          </Button>
        </form>
      </div>
      </div>

      <style>{`
        .contact-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .contact-text {
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 48px;
        }
        .social-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: border-color 0.3s, color 0.3s, transform 0.3s;
        }
        .social-link:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-2px);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }
        .form-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .form-input {
          flex: 1;
          min-width: 200px;
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          font-family: inherit;
        }
        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .form-textarea {
          width: 100%;
          resize: vertical;
        }
      `}</style>
    </section>
  )
}
