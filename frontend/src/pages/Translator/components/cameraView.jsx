import { useEffect, useRef } from "react";

export function CameraView({ videoRef, canvasRef, isActive, onError }) {
  const streamRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: { ideal: 30 } },
          audio: false,
        });

        // The user may have paused again while the permission prompt was open
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Camera access error:", err);
        onError?.("We could not open your camera. Allow camera access in your browser and try again.");
      }
    }

    function stopCamera() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) videoRef.current.srcObject = null;

      const canvas = canvasRef.current;
      if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (isActive) startCamera();
    else stopCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isActive, videoRef, canvasRef, onError]);

  return (
    <div className={`tr-camera ${isActive ? "is-live" : ""}`}>
      <video ref={videoRef} playsInline muted className="tr-video tr-mirror" />
      <canvas ref={canvasRef} width={640} height={480} className="tr-canvas tr-mirror" />

      {!isActive && (
        <div className="tr-camera-off">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <strong>The camera is off</strong>
          <span>Press "Start translating" to begin.</span>
        </div>
      )}

      {isActive && <span className="tr-live">Live</span>}
    </div>
  );
}
