import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CameraView } from './components/cameraView';
import { PredictionDisplay } from './components/predictionDisplay';
import { TranslationControls } from './components/translationControl';
import { loadISLModel } from './ml/loadModel';
import { initHolistic } from './ml/holisticTracking';
import { PredictorEngine } from './ml/prediction';
import { drawLandmarksOnCanvas } from './translator.utils';

export default function TranslatorPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const [predictionState, setPredictionState] = useState({
    status: 'idle',
    sign: null,
    confidence: 0,
    progress: 0,
    total: 50
  });

  const predictorRef = useRef(null);
  const holisticRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Initialize TF Model & MediaPipe once
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const model = await loadISLModel();
        if (!isMounted) return;

        predictorRef.current = new PredictorEngine(model);

        holisticRef.current = initHolistic(({ rawResults, landmarks }) => {
          if (!predictorRef.current) return;

          // Render skeleton on mirrored canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;
            drawLandmarksOnCanvas(ctx, rawResults, width, height);
          }

          // Run inference pipeline
          const result = predictorRef.current.processFrame(landmarks);
          setPredictionState(result);
        });

        setIsModelLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        if (isMounted) setIsModelLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Frame processing loop tied to isActive
  const processFrame = useCallback(async () => {
    if (!isActive || !videoRef.current || !holisticRef.current) return;

    if (videoRef.current.readyState >= 2) {
      await holisticRef.current.send({ image: videoRef.current });
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    } else {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    }
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive, processFrame]);

  const handleToggle = () => {
    setIsActive(prev => {
      const next = !prev;
      if (!next) {
        predictorRef.current?.reset();
        setPredictionState({
          status: 'idle',
          sign: null,
          confidence: 0,
          progress: 0,
          total: 50
        });
      }
      return next;
    });
  };

  const handleReset = () => {
    predictorRef.current?.reset();
    setPredictionState(prev => ({
      ...prev,
      status: 'buffering',
      progress: 0,
      sign: null,
      confidence: 0
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-start space-y-4">
      {/* Title */}
      <div className="w-[640px] text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Indian Sign Language Translator
        </h1>
        <p className="text-xs text-slate-400">
          Real-time client-side recognition
        </p>
      </div>

      {/* Video & Skeleton View */}
      <CameraView
        videoRef={videoRef}
        canvasRef={canvasRef}
        isActive={isActive}
      />

      {/* Controls */}
      <TranslationControls
        isActive={isActive}
        isModelLoading={isModelLoading}
        onToggle={handleToggle}
        onReset={handleReset}
      />

      {/* Prediction Output & Voice */}
      <PredictionDisplay
        predictionState={predictionState}
        autoSpeak={autoSpeak}
      />

      {/* Auto Speak Toggle */}
      <div className="w-[640px] flex justify-end">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
          Auto-speak detected signs
        </label>
      </div>
    </div>
  );
}