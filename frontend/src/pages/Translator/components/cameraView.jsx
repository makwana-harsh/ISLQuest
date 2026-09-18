import React, { useEffect } from 'react';

export function CameraView({ videoRef, canvasRef, isActive }) {
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: { ideal: 30 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="relative w-[640px] h-[480px] bg-black rounded-xl overflow-hidden shadow-lg border border-slate-700">
      <video
        ref={videoRef}
        playsInline
        muted
        className="w-full h-full object-cover transform -scale-x-100"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 pointer-events-none transform -scale-x-100"
      />
      {!isActive && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-slate-300 font-medium">
          Translation Paused
        </div>
      )}
    </div>
  );
}