export const useSpeechNotification = () => {
  const getVoice = (voiceName = "Microsoft Mark - English (United States)") => {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => v.name === voiceName) || voices[0];
  };

  const config = useRuntimeConfig()

  const soundsUrl = config.public.soundsUrl

  const soundClapping = `${soundsUrl}/applause-8.mp3`

  const playNotification = (agent) => {
    const { dbname, shipok_count, target, shipok, team_shipok, team_target, team_name } = agent;

    // 🎯 Regular motivational messages
    const regularMessages = [
      `Well done on closing a deal, ${dbname}! You now have ${shipok_count} ShipOK today. Keep up the momentum!`,
      `Nice work ${dbname}! ${shipok_count} ShipOK so far.  your consistency is paying off. Let’s keep it going!`
    ];

    // 🏆 Agent reached target message
    const agentTargetMessage = `Incredible job ${dbname}! You’ve reached your monthly target of ${target} ShipOK. You’re truly an inspiration.  keep shining!`;

    // 👥 Team reached target message
    const teamTargetMessage = `Congratulations to the entire ${team_name} team! Monthly goal achieved. teamwork makes the dream work!`;

    let messagesToPlay = [];

    if (shipok >= target) {
      messagesToPlay.push(agentTargetMessage);
    } else {
      const randomIndex = Math.floor(Math.random() * regularMessages.length);
      messagesToPlay.push(regularMessages[randomIndex]);
    }

    if (team_shipok >= team_target) {
      messagesToPlay.push(teamTargetMessage);
    }

    // 🎧 Create looping applause sound

   
    
    const applause = new Audio(soundClapping);
    applause.loop = true; // ✅ continuous loop
    applause.volume = 0.7; // not too loud
    applause.play();

    // 🗣️ Speak messages one by one
    const speakNext = (index = 0) => {
      if (index >= messagesToPlay.length) {
        // stop applause when finished
        applause.pause();
        applause.currentTime = 0;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(messagesToPlay[index]);
      utterance.rate = 1;
      utterance.pitch = 1;
      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => speakNext(index + 1);
      utterance.onerror = () => {
        applause.pause();
        applause.currentTime = 0;
      };

      speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => getVoice();
  }

  return { playNotification };
};
