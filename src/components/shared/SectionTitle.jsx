export default function SectionTitle({ subtitle, title }) {
  return (
    <div style={{ marginBottom: 48, textAlign: 'center' }}>
      {subtitle && (
        <p
          style={{
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--accent)',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </p>
      )}
      <h2>{title}</h2>
    </div>
  )
}
