export default function Button({
  children,
  variant = 'primary',
  href,
  icon: Icon,
  ...props
}) {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`btn btn-${variant}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary {
          background: linear-gradient(135deg, #a78bfa, #fb923c);
          color: #fff;
          box-shadow: 0 4px 20px rgba(167, 139, 250, 0.25);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(167, 139, 250, 0.35);
        }
        .btn-outline {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .btn-outline:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-glow);
          transform: translateY(-2px);
        }
      `}</style>
    </Tag>
  )
}
