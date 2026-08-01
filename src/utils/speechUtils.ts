// Browser Web Speech API Utility for Text-To-Speech and Speech-To-Text

export function speakText(
  text: string,
  lang: "en-US" | "en-GB" | "zh-HK" | "zh-CN" = "en-US",
  rate: number = 1.0,
  onEnd?: () => void,
  onBoundary?: (charIndex: number, charLength?: number) => void
): SpeechSynthesisUtterance | null {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    if (onEnd) onEnd();
    return null;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try to find a high quality native voice
  const voices = window.speechSynthesis.getVoices();
  let matchingVoice = voices.find((v) => v.lang === lang && v.name.includes("Natural"));
  if (!matchingVoice) {
    matchingVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
  }
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  if (onBoundary) {
    utterance.onboundary = (event) => {
      if (event.name === "word" || !event.name) {
        onBoundary(event.charIndex, event.charLength);
      }
    };
  }

  if (onEnd) {
    utterance.onend = () => {
      onEnd();
    };
    utterance.onerror = () => {
      onEnd();
    };
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
