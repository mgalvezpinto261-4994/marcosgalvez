import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Briefcase, Code2, Handshake, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

const TOKENS = [
  {
    Icon: Briefcase,
    tint: 'rgba(99,179,237,0.4)',
    glow: 'rgba(99,179,237,0.55)',
    iconColor: 'text-(--color-accent)',
    pos: { top: '10vh', left: '6vw' },
    size: 'h-20 w-20 lg:h-24 lg:w-24',
    depth: 110,
    float: { y: [0, -30, 0] },
    duration: 7,
    spinDuration: 9,
    delay: 0,
    visibleFrom: 'hidden xl:flex',
  },
  {
    Icon: Code2,
    tint: 'rgba(229,62,62,0.35)',
    glow: 'rgba(229,62,62,0.5)',
    iconColor: 'text-(--color-cta)',
    pos: { top: '6vh', left: '86vw' },
    size: 'h-16 w-16 lg:h-20 lg:w-20',
    depth: 150,
    float: { y: [0, 26, 0] },
    duration: 8.5,
    spinDuration: 7,
    delay: 0.6,
    visibleFrom: 'hidden xl:flex',
  },
  {
    Icon: Handshake,
    tint: 'rgba(99,179,237,0.35)',
    glow: 'rgba(99,179,237,0.5)',
    iconColor: 'text-(--color-accent)',
    pos: { top: '46vh', left: '11vw' },
    size: 'h-24 w-24 lg:h-28 lg:w-28',
    depth: 80,
    float: { y: [0, -24, 0] },
    duration: 9,
    spinDuration: 11,
    delay: 1.1,
    visibleFrom: 'hidden xl:flex',
  },
  {
    Icon: Wallet,
    tint: 'rgba(229,62,62,0.38)',
    glow: 'rgba(229,62,62,0.55)',
    iconColor: 'text-(--color-cta)',
    pos: { top: '52vh', left: '90vw' },
    size: 'h-20 w-20 lg:h-24 lg:w-24',
    depth: 130,
    float: { y: [0, 28, 0] },
    duration: 7.8,
    spinDuration: 8,
    delay: 0.3,
    visibleFrom: 'hidden xl:flex',
  },
  {
    Icon: ShieldCheck,
    tint: 'rgba(99,179,237,0.32)',
    glow: 'rgba(99,179,237,0.5)',
    iconColor: 'text-(--color-accent)',
    pos: { top: '84vh', left: '4vw' },
    size: 'h-16 w-16 lg:h-20 lg:w-20',
    depth: 95,
    float: { y: [0, -20, 0] },
    duration: 6.5,
    spinDuration: 10,
    delay: 1.4,
    visibleFrom: 'hidden xl:flex',
  },
  {
    Icon: Sparkles,
    tint: 'rgba(229,62,62,0.32)',
    glow: 'rgba(229,62,62,0.5)',
    iconColor: 'text-(--color-cta)',
    pos: { top: '88vh', left: '83vw' },
    size: 'h-14 w-14 lg:h-16 lg:w-16',
    depth: 100,
    float: { y: [0, 22, 0] },
    duration: 8,
    spinDuration: 6.5,
    delay: 0.9,
    visibleFrom: 'hidden xl:flex',
  },
]

function Token({ token, pointerX, pointerY }) {
  const x = useTransform(pointerX, [-1, 1], [-token.depth, token.depth])
  const y = useTransform(pointerY, [-1, 1], [-token.depth * 0.75, token.depth * 0.75])

  return (
    <motion.div
      style={{ ...token.pos, x, position: 'fixed', perspective: 900 }}
      className={`pointer-events-none ${token.visibleFrom}`}
    >
      <motion.div
        style={{ y }}
        animate={token.float}
        transition={{ duration: token.duration, delay: token.delay, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <motion.div
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: 360 }}
          transition={{ duration: token.spinDuration, delay: token.delay, repeat: Infinity, ease: 'linear' }}
          className={`relative flex items-center justify-center rounded-full border border-white/15 backdrop-blur-md ${token.size}`}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 18px 2px ${token.glow}, 0 25px 35px -12px rgba(0,0,0,0.55)`,
                `0 0 42px 10px ${token.glow}, 0 25px 35px -12px rgba(0,0,0,0.55)`,
                `0 0 18px 2px ${token.glow}, 0 25px 35px -12px rgba(0,0,0,0.55)`,
              ],
            }}
            transition={{ duration: token.duration * 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3), ${token.tint} 70%)`,
            }}
          />
          <token.Icon className={`relative ${token.iconColor}`} size={24} style={{ transform: 'translateZ(1px)' }} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function GlassField() {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 55, damping: 16 })
  const pointerY = useSpring(rawY, { stiffness: 55, damping: 16 })
  const spotlightX = useSpring(rawX, { stiffness: 25, damping: 22 })
  const spotlightY = useSpring(rawY, { stiffness: 25, damping: 22 })

  useEffect(() => {
    const handleMove = (e) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [rawX, rawY])

  const spotlightLeft = useTransform(spotlightX, [-1, 1], ['0%', '100%'])
  const spotlightTop = useTransform(spotlightY, [-1, 1], ['0%', '100%'])

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <motion.div
        className="absolute h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] mix-blend-screen blur-[90px]"
        style={{
          left: spotlightLeft,
          top: spotlightTop,
          background:
            'radial-gradient(circle, rgba(99,179,237,0.9) 0%, rgba(99,179,237,0) 70%)',
        }}
      />

      {TOKENS.map((token, i) => (
        <Token key={i} token={token} pointerX={pointerX} pointerY={pointerY} />
      ))}
    </div>
  )
}
