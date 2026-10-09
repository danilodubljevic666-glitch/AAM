import { useEffect, useRef, useState } from 'react'

// Naslov se sklapa slovo po slovo: svako slovo ulazi odozdo iz svog "prozora".
// Tekst se zadaje kao `text` (obično) ili `parts` kad dio treba drugu boju:
//   parts={[{ t: 'Najbolje ideje ' }, { t: 'ne dolaze', c: 'text-alarm' }, { t: ' u podne.' }]}
// Čitačima ekrana se nudi cijela rečenica odjednom (aria-label), ne slovo po slovo.
export default function SplitText({
  as: Tag = 'span',
  text,
  parts,
  delay = 0,
  step = 26,
  className = '',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const segments = parts ?? [{ t: text ?? '' }]
  const whole = segments.map((s) => s.t).join('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let index = 0

  return (
    <Tag ref={ref} aria-label={whole} className={`split ${visible ? 'is-visible' : ''} ${className}`}>
      {segments.map((segment, s) => (
        <span key={s} className={segment.c ?? ''} aria-hidden="true">
          {segment.t.split(' ').map((word, w, words) => (
            <span key={w} className="split-word">
              {[...word].map((char) => (
                <span key={index} className="split-char" style={{ transitionDelay: `${delay + index++ * step}ms` }}>
                  {char}
                </span>
              ))}
              {w < words.length - 1 && '\u00A0'}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
