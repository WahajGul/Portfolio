import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useScrollAnimations(ref, options = {}) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { from = {}, to = {}, once = true } = optionsRef.current

    const ctx = gsap.fromTo(
      el,
      { opacity: 0, y: 40, ...from },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
        ...to,
      }
    )

    return () => ctx.revert()
  }, [ref])
}
