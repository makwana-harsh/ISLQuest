import { VoiceButton } from "./voiceButton";

const STATUS_LABELS = {
  idle: "Waiting",
  buffering: "Collecting frames",
  predicting: "Recognising",
  detected: "Sign found",
};

export function PredictionDisplay({ predictionState, autoSpeak = false }) {
  const { status, sign, confidence, progress, total } = predictionState;

  const label = sign ? String(sign).replace(/_/g, " ") : "";
  const percent = Math.round((Number(confidence) || 0) * 100);
  const bufferPct = total > 0 ? Math.min(100, (progress / total) * 100) : 0;

  return (
    <section className="tr-result" aria-live="polite">
      <div className="tr-result-top">
        <h2>Detected sign</h2>
        <span className={`tr-status is-${status}`}>{STATUS_LABELS[status] || status}</span>
      </div>

      <p className={`tr-sign ${label ? "" : "is-empty"}`}>{label || "Nothing yet"}</p>

      {percent > 0 && (
        <div className="tr-confidence">
          <div className="tr-meter" role="img" aria-label={`${percent}% match`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <span>{percent}% match</span>
        </div>
      )}

      {status === "buffering" && (
        <div className="tr-buffer">
          <span>Keep signing, gathering movement</span>
          <div className="tr-meter tr-meter--buffer" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(bufferPct)}>
            <span style={{ width: `${bufferPct}%` }} />
          </div>
        </div>
      )}

      <VoiceButton currentSign={sign} autoSpeak={autoSpeak} />
    </section>
  );
}
