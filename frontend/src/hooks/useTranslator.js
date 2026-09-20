import { useState, useEffect, useRef, useCallback } from 'react';
import { loadISLModel } from '../ml/loadModel';
import { initHolistic } from '../ml/holisticTracking';
import { PredictorEngine } from '../ml/prediction';
import { drawLandmarksOnCanvas } from '../translator.utils';

export function useTranslator(videoRef, canvasRef) {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [predictionState, setPredictionState] = useState({
    status: 'idle', // 'idle' | 'no_hands' | 'buffering' | 'listening' | 'detected'
    sign: null,
    confidence: 0,
    progress: 0,
    total: 50
  });

  const predictorRef = useRef(null);
  const holisticRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const streamRef = useRef(null);

  // 1. Initialize TF Model & MediaPipe once on mount
  useEffect(() => {
    let isMounted = true;

    async function initEngine() {
      try {
        const model = await loadISLModel();
        if (!isMounted) return;

        predictorRef.current = new PredictorEngine(model);

        holisticRef.current = initHolistic(({ rawResults, landmarks }) => {
          if (!predictorRef.current) return;

          // Draw skeleton overlay if enabled
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;
            if (showSkeleton) {
              drawLandmarksOnCanvas(ctx, rawResults, width, height);
            } else {
              ctx.clearRect(0, 0, width, height);
            }
          }

          // Run inference pipeline
          const result = predictorRef.current.processFrame(landmarks);
          setPredictionState(result);
        });

        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to initialize translator ML engine:', err);
        if (isMounted) setIsModelLoading(false);
      }
    }

    initEngine();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // 2. Start Camera (Manual Trigger)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: { ideal: 30 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
    } catch (err) {
      console.error('Webcam access error:', err);
      alert('Unable to access webcam. Please check browser permissions.');
    }
  };

  // 3. Stop Camera
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    predictorRef.current?.reset();
    setIsCameraActive(false);
    setPredictionState({
      status: 'idle',
      sign: null,
      confidence: 0,
      progress: 0,
      total: 50
    });
  };

  // 4. Video Frame Processing Loop
  const processFrameLoop = useCallback(async () => {
    if (!isCameraActive || !videoRef.current || !holisticRef.current) return;

    if (videoRef.current.readyState >= 2) {
      await holisticRef.current.send({ image: videoRef.current });
    }

    animFrameIdRef.current = requestAnimationFrame(processFrameLoop);
  }, [isCameraActive, videoRef]);

  useEffect(() => {
    if (isCameraActive) {
      animFrameIdRef.current = requestAnimationFrame(processFrameLoop);
    } else {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    }
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isCameraActive, processFrameLoop]);

  const toggleCamera = () => {
    if (isCameraActive) stopCamera();
    else startCamera();
  };

  const resetBuffer = () => {
    predictorRef.current?.reset();
    setPredictionState(prev => ({
      ...prev,
      status: 'buffering',
      progress: 0,
      sign: null,
      confidence: 0
    }));
  };

  return {
    isModelLoading,
    isCameraActive,
    showSkeleton,
    setShowSkeleton,
    predictionState,
    toggleCamera,
    resetBuffer
  };
}