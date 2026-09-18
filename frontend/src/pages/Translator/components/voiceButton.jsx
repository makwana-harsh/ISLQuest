import React, { useEffect, useRef } from 'react';
import { speakText } from '../translator.utils';

export function VoiceButton({ currentSign, autoSpeak = false }) {
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    if (autoSpeak && currentSign && currentSign !== lastSpokenRef.current) {
      speakText(currentSign);
      lastSpokenRef.current = currentSign;
    }
  }, [currentSign, autoSpeak]);

  return (
    <button
      onClick={() => speakText(currentSign)}
      disabled={!currentSign}
      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
      title="Speak Detected Sign"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </button>
  );
}