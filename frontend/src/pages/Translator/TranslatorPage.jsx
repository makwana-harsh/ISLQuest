import { useRef, useState, useEffect, useCallback } from "react";

import { CameraView } from "./components/cameraView";
import { PredictionDisplay } from "./components/predictionDisplay";
import { TranslationControls } from "./components/translationControl";
import { loadISLModel } from "./ml/loadModel";
import { initHolistic } from "./ml/holisticTracking";
import { PredictorEngine } from "./ml/prediction";
import { drawLandmarksOnCanvas } from "./translator.utils";

import "../../styles/Translator/TranslatorPage.style.css";

const IDLE_STATE = {
  status: "idle",
  sign: null,
  confidence: 0,
  progress: 0,
  total: 50,
};

export default function TranslatorPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [notice, setNotice] = useState("");

  const [predictionState, setPredictionState] = useState(IDLE_STATE);

  const predictorRef = useRef(null);
  const holisticRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Load the TF model and MediaPipe once
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const model = await loadISLModel();
        if (!isMounted) return;

        predictorRef.current = new PredictorEngine(model);

        holisticRef.current = initHolistic(({ rawResults, landmarks }) => {
          if (!predictorRef.current) return;

          // Draw the skeleton on the mirrored canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            const { width, height } = canvasRef.current;
            drawLandmarksOnCanvas(ctx, rawResults, width, height);
          }

          // Run the recognition pipeline
          setPredictionState(predictorRef.current.processFrame(landmarks));
        });

        setIsModelLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        if (isMounted) {
          setNotice("The translator could not load. Check your connection and refresh the page.");
          setIsModelLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      try {
        holisticRef.current?.close?.();
      } catch {
        /* already closed */
      }
    };
  }, []);

  // Frame loop, only runs while translating
  const processFrame = useCallback(async () => {
    if (!isActive || !videoRef.current || !holisticRef.current) return;

    if (videoRef.current.readyState >= 2) {
      try {
        await holisticRef.current.send({ image: videoRef.current });
      } catch (err) {
        console.error("Frame processing error:", err);
      }
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [isActive]);

  useEffect(() => {
    if (isActive) animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive, processFrame]);

  const handleCameraError = useCallback((text) => {
    setNotice(text);
    setIsActive(false);
    predictorRef.current?.reset();
    setPredictionState(IDLE_STATE);
  }, []);

  const handleToggle = () => {
    setNotice("");

    if (isActive) {
      setIsActive(false);
      predictorRef.current?.reset();
      setPredictionState(IDLE_STATE);
    } else {
      setIsActive(true);
    }
  };

  const handleReset = () => {
    predictorRef.current?.reset();
    setPredictionState((previous) => ({
      ...previous,
      status: "buffering",
      progress: 0,
      sign: null,
      confidence: 0,
    }));
  };

  return (
    <div className="ui-scope ui-page tr-page">
      <div className="ui-wrap">
        <header className="tr-head">
          <h1>Sign translator</h1>
          <p>Sign in front of your camera and the detected word appears beside it. Everything runs in your browser, so your video never leaves your device.</p>
        </header>

        {notice && (
          <p className="ui-alert tr-notice" role="alert">
            {notice}
          </p>
        )}

        <div className="tr-layout">
          <CameraView videoRef={videoRef} canvasRef={canvasRef} isActive={isActive} onError={handleCameraError} />

          <div className="tr-side">
            <TranslationControls
              isActive={isActive}
              isModelLoading={isModelLoading}
              onToggle={handleToggle}
              onReset={handleReset}
            />

            <PredictionDisplay predictionState={predictionState} autoSpeak={autoSpeak} />

            <label className="tr-check">
              <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
              <span>Read detected signs out loud</span>
            </label>

            <div className="tr-tips">
              <h3>For best results</h3>
              <ul>
                <li>Sit in good light, facing the camera.</li>
                <li>Keep both hands and your face inside the frame.</li>
                <li>Sign one word, then pause until it appears.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
