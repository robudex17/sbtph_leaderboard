export const useSpeechNotification = () => {
  const config = useRuntimeConfig()
  const soundsUrl = config.public.soundsUrl
  const soundClapping = `${soundsUrl}/applause-8.mp3`

  // 🗣️ Load or fallback to default voice
  const getVoice = (voiceName = "Microsoft Mark - English (United States)") => {
    const voices = speechSynthesis.getVoices()
    if (!voices.length) return null
    return voices.find(v => v.name === voiceName) || voices[0]
  }

  const ensureVoicesLoaded = async () => {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices()
      if (voices.length) resolve(voices)
      else speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices())
    })
  }

  const playNotification = async (agent) => {
    const { dbname, shipok_count, target, shipok, team_shipok, team_target, team_name } = agent

    const regularMessages = [
      `Well done on closing a deal, ${dbname}! You now have ${shipok_count} ShipOK today. Keep up the momentum!`,
      `Nice work ${dbname}! ${shipok_count} ShipOK so far. Your consistency is paying off. Let’s keep it going!`
    ]

    const agentTargetMessage = `Incredible job ${dbname}! You’ve reached your monthly target of ${target} ShipOK. You’re truly an inspiration. Keep shining!`
    const teamTargetMessage = `Congratulations to the entire ${team_name} team! Monthly goal achieved. Teamwork makes the dream work!`

    let messagesToPlay = []

    if (shipok >= target) {
      messagesToPlay.push(agentTargetMessage)
    } else {
      const randomIndex = Math.floor(Math.random() * regularMessages.length)
      messagesToPlay.push(regularMessages[randomIndex])
    }

    if (team_shipok >= team_target) {
      messagesToPlay.push(teamTargetMessage)
    }

    // 🎧 Applause setup
    const applause = new Audio(soundClapping)
    applause.loop = true
    applause.volume = 0.7

    // Wait a little in case alert() just happened
    await new Promise(resolve => setTimeout(resolve, 500))

    // Try to play the applause
    let canPlay = true
    try {
      await applause.play()
    } catch (e) {
      console.warn("⚠️ Autoplay blocked. Sound will start after user clicks.", e)
      canPlay = false
    }

    // Wait for voices to load
    await ensureVoicesLoaded()

    const speakNext = (index = 0) => {
      if (index >= messagesToPlay.length) {
        applause.pause()
        applause.currentTime = 0
        return
      }

      const utterance = new SpeechSynthesisUtterance(messagesToPlay[index])
      utterance.rate = 1
      utterance.pitch = 1
      const voice = getVoice()
      if (voice) utterance.voice = voice

      utterance.onend = () => speakNext(index + 1)
      utterance.onerror = () => {
        applause.pause()
        applause.currentTime = 0
      }

      speechSynthesis.speak(utterance)
    }

    speakNext()

    // If autoplay was blocked, wait for user click to start clapping
    if (!canPlay) {
      const handleClick = async () => {
        try {
          await applause.play()
          window.removeEventListener('click', handleClick)
        } catch (err) {
          console.warn("Still blocked after click:", err)
        }
      }
      window.addEventListener('click', handleClick)
    }
  }

  return { playNotification }
}
