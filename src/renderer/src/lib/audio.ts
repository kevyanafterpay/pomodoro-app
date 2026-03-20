let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export function playPhaseCompleteSound(volume: number): void {
  const ctx = getAudioContext()
  const gainNode = ctx.createGain()
  gainNode.gain.value = volume
  gainNode.connect(ctx.destination)

  const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 — ascending chime
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(gainNode)
    const startTime = ctx.currentTime + i * 0.2
    osc.start(startTime)
    osc.stop(startTime + 0.3)
  })
}

export function playTickSound(volume: number): void {
  const ctx = getAudioContext()
  const gainNode = ctx.createGain()
  gainNode.gain.value = volume * 0.1
  gainNode.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 800
  osc.connect(gainNode)
  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}
