import { useState, useEffect, useRef, useCallback } from 'react';
import { loadISLModel } from '../ml/loadModel';
import { initHolistic } from '../ml/holisticTracking';
import { PredictorEngine } from '../ml/prediction';

export function useTranslator(videoRef, canvasRef) {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
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

  useEffect(() => {
    async function setup() {
      try {
        const model = await loadISLModel();
        predictorRef.current = new PredictorEngine(model);

        holisticRef.current = initHolistic(({ rawResults, landmarks }) => {
          if (!predictorRef.current) return;
          const result = predictorRef.current.processFrame(landmarks);
          setPredictionState(result);

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;
            ctx.clearRect(0, 0, width, height);
          }
        });

        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to load ML model or MediaPipe:', err);
        setIsModelLoading(false);
      }
    }
    setup();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [canvasRef]);

  const processVideoFrame = useCallback(async () => {
    if (!isActive || !videoRef.current || !holisticRef.current) return;

    if (videoRef.current.readyState >= 2) {
      await holisticRef.current.send({ image: videoRef.current });
    }

    animFrameIdRef.current = requestAnimationFrame(processVideoFrame);
  }, [isActive, videoRef]);

  useEffect(() => {
    if (isActive) {
      animFrameIdRef.current = requestAnimationFrame(processVideoFrame);
    } else if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      predictorRef.current?.reset();
    }
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive, processVideoFrame]);

  const toggleTranslation = () => setIsActive(prev => !prev);
  const resetBuffer = () => predictorRef.current?.reset();

  return {
    isModelLoading,
    isActive,
    predictionState,
    toggleTranslation,
    resetBuffer
  };
}