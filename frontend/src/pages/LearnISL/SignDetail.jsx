function SignDetail({ sign, onClose }) {
  return (
    <div className="detail-overlay">

      <div className="detail-container">

        <button
          className="back-button"
          onClick={onClose}
        >
          ← Back
        </button>

        <div className="sign-video-container">
          {sign.videoUrl ? (
            <video
              src={sign.videoUrl}
              controls
              playsInline
            />
          ) : (
            <div className="video-placeholder">
              Video not available yet
            </div>
          )}
        </div>

        <h1>{sign.signName}</h1>

        <section>
          <h3>Usage</h3>
          <p>{sign.usage || "Not available."}</p>
        </section>

        <section>
          <h3>Meaning</h3>
          <p>{sign.meaning}</p>
        </section>

      </div>

    </div>
  );
}

export default SignDetail;