import { useEffect, useRef, useState } from "react";
import { submitContribution } from "../../api/contribution.api";

function ContributionForm({ onBack, onSubmitted }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const [form, setForm] = useState({
    signName: "",
    description: "",
    meaning: "",
    usage: "",
  });

  const [video, setVideo] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Safely attach stream to video element when camera opens
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOpen, stream]);

  // Clean up media tracks on unmount ONLY
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError("");
      if (cameraOpen) return;

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(cameraStream);
      setCameraOpen(true);
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraOpen(false);
  };

  const startRecording = () => {
    if (!stream) {
      setError("Please start the camera first.");
      return;
    }
    setError("");

    // Detect browser-supported video MIME type (iOS vs Chrome/Firefox)
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const extension = mimeType.includes("mp4") ? "mp4" : "webm";
      const recordedFile = new File([blob], `contribution.${extension}`, {
        type: mimeType,
      });

      setVideo(recordedFile);
      stopCamera();
    };

    recorder.onerror = (err) => {
      console.error("MediaRecorder error:", err);
      setError("Failed to record video.");
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setRecording(false);
    setMediaRecorder(null);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    setError("");
    setVideo(file);
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (recording) {
      setError("Please stop recording before submitting.");
      return;
    }

    if (!video) {
      setError("Please record or upload a video.");
      return;
    }

    if (!form.signName.trim() || !form.meaning.trim() || !form.usage.trim()) {
      setError("Sign name, meaning, and usage are required.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video", video);
      formData.append("signName", form.signName);
      formData.append("description", form.description);
      formData.append("meaning", form.meaning);
      formData.append("usage", form.usage);
      formData.append("example", form.example);

      await submitContribution(formData);
      onSubmitted();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit contribution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contribute-form-overlay">
      <div className="contribute-form">
        <button type="button" onClick={onBack} className="back-button">
          ← Back
        </button>

        <h1>Contribute a Sign</h1>

        {error && <p className="contribute-error">{error}</p>}

        <div className="video-actions">
          {!cameraOpen ? (
            <button type="button" onClick={startCamera} disabled={loading}>
              Start Camera
            </button>
          ) : (
            <button type="button" onClick={stopCamera} disabled={recording || loading}>
              Close Camera
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={recording || loading}
          >
            Upload File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={handleFile}
          />
        </div>

        {cameraOpen && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay muted playsInline />

            {!recording ? (
              <button type="button" onClick={startRecording} disabled={loading}>
                Start Recording
              </button>
            ) : (
              <button type="button" onClick={stopRecording} disabled={loading}>
                Stop Recording
              </button>
            )}
          </div>
        )}

        {video && (
          <p>
            Selected video: <strong>{video.name}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Sign Name *
            <input
              name="signName"
              value={form.signName}
              onChange={handleChange}
              placeholder="Example: Medicine"
              disabled={loading}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Why are you contributing this sign?"
              disabled={loading}
            />
          </label>

          <label>
            Meaning *
            <textarea
              name="meaning"
              value={form.meaning}
              onChange={handleChange}
              placeholder="What does this sign mean?"
              disabled={loading}
            />
          </label>

          <label>
            Usage *
            <textarea
              name="usage"
              value={form.usage}
              onChange={handleChange}
              placeholder="When is this sign used?"
              disabled={loading}
            />
          </label>


          <button type="submit" disabled={loading || recording}>
            {loading ? "Submitting..." : "Submit Contribution"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContributionForm;