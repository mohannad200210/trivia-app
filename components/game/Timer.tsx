'use client'

import { useEffect, useState } from 'react'

/**
 * Timer — informational countdown for /question.
 * Per /SKILL.md §5: default 30s, does NOT auto-advance when it hits 0
 * (host controls pacing). Pause/resume + reset controls per DESIGN.md
 * "Question / Answer screens" / Timer.
 *
 * Tabular numerals + monospace fallback prevent width jitter as digits
 * change. `role="timer"` + `aria-live="off"` (announcing every second
 * is hostile to screen readers).
 */

const DEFAULT_SECONDS = 30

interface TimerProps {
  initialSeconds?: number
}

export function Timer({ initialSeconds = DEFAULT_SECONDS }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || seconds <= 0) return
    const id = window.setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [paused, seconds])

  const finished = seconds === 0

  return (
    <div
      className="flex items-center justify-center gap-3"
      role="timer"
      aria-live="off"
      aria-atomic="true"
    >
      <span
        className="text-5xl sm:text-6xl font-extrabold text-white tabular-nums font-mono w-24 text-center"
        aria-label={`${seconds} ثانية متبقية`}
      >
        {seconds}
      </span>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          disabled={finished}
          aria-label={paused ? 'استئناف العداد' : 'إيقاف العداد'}
          className="rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed w-10 h-10 text-base font-bold text-white transition-colors flex items-center justify-center"
        >
          {paused ? '▶' : '⏸'}
        </button>
        <button
          type="button"
          onClick={() => {
            setSeconds(initialSeconds)
            setPaused(false)
          }}
          aria-label="إعادة العداد"
          className="rounded-full bg-white/10 hover:bg-white/15 w-10 h-10 text-base font-bold text-white transition-colors flex items-center justify-center"
        >
          ↺
        </button>
      </div>
    </div>
  )
}
