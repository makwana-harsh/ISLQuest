import { useEffect, useRef } from "react";

import { speakText } from "../translator.utils";

export function VoiceButton({ currentSign, autoSpeak = false }) {
  const lastSpokenRef = useRef(null);

  const spoken = currentSign ? String(currentSign).replace(/_/g, " ") : "";

  useEffect(() => {
    // Forget the last word when the sign clears so it can be spoken again
    if (!currentSign) {
      lastSpokenRef.current = null;
      return;
    }

    if (autoSpeak && currentSign !== lastSpokenRef.current) {
      speakText(spoken);
      lastSpokenRef.current = currentSign;
    }
  }, [currentSign, autoSpeak, spoken]);

  return (
    <button
      type="button"
      className="ui-btn ui-btn--sm tr-voice"
      onClick={() => speakText(spoken)}
      disabled={!currentSign}
      aria-label="Speak the detected sign"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
      </svg>
      Speak
    </button>
  );
}
