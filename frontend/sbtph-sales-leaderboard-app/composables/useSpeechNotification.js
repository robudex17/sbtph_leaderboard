// ~/composables/useSpeechNotification.js
import { ref } from 'vue'

export const useSpeechNotification = () => {
  const unlocked = ref(false)

  // Unlock audio on first user interaction
  const unlockAudio = () => {
    if (unlocked.value) return
    const testAudio = new Audio('/applause-8.mp3')
    testAudio.play().catch(() => {}).finally(() => {
      testAudio.pause()
      testAudio.currentTime = 0
      unlocked.value = true
      window.removeEventListener('click', unlockAudio)
    })
  }

  // Listen for first click anywhere in the app
  window.addEventListener('click', unlockAudio)

  const getVoice = (voiceName = "Microsoft Mark - English (United States)") => {
    const voices = speechSynthesis.getVoices()
    return voices.find(v => v.name === voiceName) || voices[0]
  }

  const playNotification = async (agent) => {
    if (!unlocked.value) {
      console.warn('Audio not unlocked yet. Click anywhere to enable sound.')
    }

    const { dbname, shipok_count, target, shipok, team_shipok, team_target, team_name } = agent

    // 🎯 Regular motivational messages
    const regularMessages = [
      `Well done on closing a deal, ${dbname}! You now have ${shipok_count} ShipOK today. Keep up the momentum!`,
      `Nice work ${dbname}! ${shipok_count} ShipOK so far. Your consistency is paying off. Let’s keep it going!`
    ]

    // 🏆 Agent reached target message
    const agentTargetMessage = `Incredible job ${dbname}! You’ve reached your monthly target of ${target} ShipOK. You’re truly an inspiration. Keep shining!`

    // 👥 Team reached target message
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

    // 🎧 Prepare applause audio
    const applause = new Audio('/applause-8.mp3')
    applause.loop = true
    applause.volume = 0.7

    // Wait for user to unlock audio before playing
    if (unlocked.value) {
      try {
        await applause.play()
      } catch (e) {
        console.warn('Applause blocked by browser autoplay policy:', e)
      }
    }

    // 🗣️ Speak messages sequentially
    const speakNext = (index = 0) => {
      if (index >= messagesToPlay.length) {
        // Stop applause when done
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
  }

  // Ensure voices are loaded
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => getVoice()
  }

  return { playNotification }
}
