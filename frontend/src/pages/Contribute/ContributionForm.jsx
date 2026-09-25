import { useEffect, useRef, useState } from "react";

import { submitContribution } from "../../api/contribution.api";

const MIN_SECONDS = 3;
const MAX_SECONDS = 8;

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) return "video/webm;codecs=vp9";
  if (MediaRecorder.isTypeSupported("video/webm")) return "video/webm";
  return "video/mp4"; // Safari / iOS
}

function ContributionForm({ onBack, onSubmitted }) {
  const fileInputRef = useRef(null);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);

  const [form, setForm] = useState({
    signName: "",
    description: "",
    meaning: "",
    usage: "",
    example: "",
  });

  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  // Preview URL for the chosen / recorded video (revoked when replaced)
  useEffect(() => {
    if (!video) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(video);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  // Attach the camera stream once the <video> element exists
  useEffect(() => {
    if (cameraOpen && liveVideoRef.current && streamRef.current) {
      liveVideoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  // Release camera + recorder when leaving the screen
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopCamera = () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const startCamera = async () => {
    if (cameraOpen) return;
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser does not support camera access. Try uploading a file instead.");
      return;
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraOpen(true);
    } catch (err) {
      console.error(err);
      setError("Unable to access the camera. Please allow camera permission and try again.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setError("Start the camera first.");
      return;
    }

    const mimeType = pickMimeType();
    if (!mimeType) {
      setError("Recording is not supported in this browser. Try uploading a file instead.");
      return;
    }

    setError("");

    let recorder;
    try {
      recorder = new MediaRecorder(streamRef.current, { mimeType });
    } catch (err) {
      console.error(err);
      setError("Could not start recording in this browser. Try uploading a file instead.");
      return;
    }

    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };

    recorder.onerror = (event) => {
      console.error("MediaRecorder error:", event);
      clearInterval(timerRef.current);
      setRecording(false);
      setError("Failed to record video.");
    };

    recorder.onstop = () => {
      clearInterval(timerRef.current);
      setRecording(false);
      recorderRef.current = null;

      const elapsed = (Date.now() - startedAtRef.current) / 1000;

      if (elapsed < MIN_SECONDS) {
        setError(`That recording was too short. Please record at least ${MIN_SECONDS} seconds.`);
        return;
      }

      const blob = new Blob(chunks, { type: mimeType });
      const extension = mimeType.includes("mp4") ? "mp4" : "webm";
      setVideo(new File([blob], `contribution.${extension}`, { type: mimeType }));
      stopCamera();
    };

    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setSeconds(0);
    recorder.start();
    setRecording(true);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      setSeconds(elapsed);
      if (elapsed >= MAX_SECONDS) stopRecording();
    }, 200);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    setError("");
    if (cameraOpen) stopCamera();
    setVideo(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (recording) {
      setError("Stop recording before you submit.");
      return;
    }

    if (!video) {
      setError("Record or upload a video of the sign.");
      return;
    }

    if (!form.signName.trim() || !form.meaning.trim() || !form.usage.trim()) {
      setError("Sign name, meaning and usage are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("video", video);
      formData.append("signName", form.signName.trim());
      formData.append("description", form.description.trim());
      formData.append("meaning", form.meaning.trim());
      formData.append("usage", form.usage.trim());
      formData.append("example", form.example.trim());

      await submitContribution(formData);
      onSubmitted();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit contribution.");
      setLoading(false);
    }
  };

  const busy = loading || recording;

  return (
    <div className="ui-scope ui-overlay">
      <div className="ct-form-wrap">
        <button type="button" onClick={onBack} className="ui-back" disabled={loading}>
          Back
        </button>

        <h1 className="ct-form-title">Contribute a sign</h1>
        <p className="ct-muted">Show the sign on video, then tell us what it means and when to use it.</p>

        {error && (
          <p className="ui-alert ct-form-alert" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="ct-form">
          <div className="ct-media">
            <div className={`ct-stage ${video && !cameraOpen ? "has-video" : ""}`}>
              {cameraOpen && (
                <>
                  <video ref={liveVideoRef} className="ct-live" autoPlay muted playsInline />
                  {recording && (
                    <span className="ct-rec">
                      <i /> {seconds.toFixed(1)}s / {MAX_SECONDS}s
                    </span>
                  )}
                </>
              )}

              {!cameraOpen && previewUrl && <video className="ct-preview" src={previewUrl} controls playsInline />}

              {!cameraOpen && !previewUrl && (
                <p className="ct-stage-empty">
                  Record a video of {MIN_SECONDS} to {MAX_SECONDS} seconds, or upload one from your device.
                </p>
              )}
            </div>

            {video && !cameraOpen && (
              <p className="ct-file">
                <strong>{video.name}</strong>
                <button type="button" onClick={() => setVideo(null)} disabled={loading}>
                  Remove
                </button>
              </p>
            )}

            <div className="ct-media-actions">
              {!cameraOpen ? (
                <button type="button" className="ui-btn ui-btn--sm" onClick={startCamera} disabled={busy}>
                  Open camera
                </button>
              ) : (
                <>
                  {!recording ? (
                    <button type="button" className="ui-btn ui-btn--sm ui-btn--primary" onClick={startRecording} disabled={loading}>
                      Start recording
                    </button>
                  ) : (
                    <button type="button" className="ui-btn ui-btn--sm ui-btn--danger" onClick={stopRecording}>
                      Stop recording
                    </button>
                  )}
                  <button type="button" className="ui-btn ui-btn--sm" onClick={stopCamera} disabled={busy}>
                    Close camera
                  </button>
                </>
              )}

              <button type="button" className="ui-btn ui-btn--sm" onClick={() => fileInputRef.current?.click()} disabled={busy}>
                Upload a file
              </button>

              <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={handleFile} />
            </div>
          </div>

          <div className="ct-fields">
            <label className="ui-field">
              Sign name *
              <input
                className="ui-input"
                name="signName"
                value={form.signName}
                onChange={handleChange}
                placeholder="For example: Medicine"
                disabled={loading}
              />
            </label>

            <label className="ui-field">
              Meaning *
              <textarea
                className="ui-textarea"
                name="meaning"
                value={form.meaning}
                onChange={handleChange}
                placeholder="What does this sign mean?"
                disabled={loading}
              />
            </label>

            <label className="ui-field">
              Usage *
              <textarea
                className="ui-textarea"
                name="usage"
                value={form.usage}
                onChange={handleChange}
                placeholder="When and how is this sign used?"
                disabled={loading}
              />
            </label>

            <label className="ui-field">
              Example sentence
              <textarea
                className="ui-textarea"
                name="example"
                value={form.example}
                onChange={handleChange}
                placeholder="Optional. A short sentence that uses the sign."
                disabled={loading}
              />
            </label>

            <label className="ui-field">
              Why are you adding it?
              <textarea
                className="ui-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional. Anything the moderator should know."
                disabled={loading}
              />
            </label>

            <button type="submit" className="ui-btn ui-btn--primary ct-submit" disabled={busy}>
              {loading ? "Submitting..." : "Submit for review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContributionForm;
