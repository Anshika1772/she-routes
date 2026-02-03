"use client"

import { useState, useRef, useCallback } from "react"

export function useEmergencySiren() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const startSiren = useCallback(() => {
    if (isPlaying) return

    // Create or get audio element
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
    }

    // Generate emergency siren sound programmatically using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = 30 // 30 seconds
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set initial parameters
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)

    // Create siren effect with frequency changes
    let time = audioContext.currentTime
    for (let i = 0; i < duration * 2; i++) {
      const freq = i % 2 === 0 ? 800 : 600
      oscillator.frequency.setTargetAtTime(freq, time, 0.1)
      time += 0.5
    }

    oscillator.start(audioContext.currentTime)

    setIsPlaying(true)

    // Stop after 30 seconds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      oscillator.stop(audioContext.currentTime)
      gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.1)
      setIsPlaying(false)
    }, duration * 1000)
  }, [isPlaying])

  const stopSiren = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [])

  return { isPlaying, startSiren, stopSiren }
}
