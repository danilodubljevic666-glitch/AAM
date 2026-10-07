// Privremena SVG ilustracija majice dok ne stignu prave fotografije
export default function TeeGraphic({ color, ink, print, className = '' }) {
  const lines = print.split('\n')
  const fontSize = lines.length > 1 ? 34 : 44
  const startY = 150 - ((lines.length - 1) * fontSize * 0.95) / 2

  return (
    <svg viewBox="0 0 300 320" className={className} role="img" aria-label={`Majica — ${print.replace('\n', ' ')}`}>
      <path
        d="M105 20 L60 35 L10 80 L40 125 L70 105 L70 300 L230 300 L230 105 L260 125 L290 80 L240 35 L195 20 Q150 55 105 20 Z"
        fill={color}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M105 20 Q150 55 195 20" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="4" />
      {lines.map((line, i) => (
        <text
          key={i}
          x="150"
          y={startY + i * fontSize * 0.95}
          textAnchor="middle"
          fill={ink}
          fontFamily="Anton, Impact, sans-serif"
          fontSize={fontSize}
          letterSpacing="1"
        >
          {line}
        </text>
      ))}
    </svg>
  )
}
