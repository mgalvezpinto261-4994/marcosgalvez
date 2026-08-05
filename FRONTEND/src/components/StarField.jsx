import { useEffect, useRef } from 'react'

const STAR_COUNT = 160

export default function StarField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let stars = []
    let frameId = null

    const makeStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: Math.random() * 0.08 + 0.02,
      }))
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeStars()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      stars.forEach((s) => {
        ctx.beginPath()
        ctx.fillStyle = `rgba(200, 225, 255, ${s.baseAlpha})`
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    let t = 0
    const drawFrame = () => {
      t += 1
      ctx.clearRect(0, 0, width, height)
      stars.forEach((s) => {
        s.x += s.driftX
        s.y += s.driftY
        if (s.y > height) s.y = 0
        if (s.y < 0) s.y = height
        if (s.x > width) s.x = 0
        if (s.x < 0) s.x = width

        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.25
        ctx.beginPath()
        ctx.fillStyle = `rgba(200, 225, 255, ${Math.max(alpha, 0.05)})`
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      frameId = requestAnimationFrame(drawFrame)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      drawStatic()
    } else {
      frameId = requestAnimationFrame(drawFrame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}
