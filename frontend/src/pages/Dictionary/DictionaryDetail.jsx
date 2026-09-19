import { useEffect, useState } from "react";
import { getDictionarySignById } from "../../api/dictionary.api";

function DictionaryDetail({ signId, onClose }) {
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSign = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getDictionarySignById(signId);

        setSign(data.sign);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load sign"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSign();
  }, [signId]);

  return (
    <div className="dictionary-detail-overlay">
      <button
        type="button"
        className="dictionary-detail-close"
        onClick={onClose}
      >
        Close
      </button>

      {loading && <p>Loading...</p>}

      {message && <p>{message}</p>}

      {sign && (
        <div className="dictionary-detail-content">
          <h1>{sign.signName}</h1>

          <p>
            <strong>Meaning:</strong>
          </p>
          <p>{sign.meaning}</p>

          <p>
            <strong>Usage:</strong>
          </p>
          <p>{sign.usage}</p>

          <p>
            <strong>Source Type:</strong>
          </p>
          <p>{sign.sourceType}</p>

          <p>
            <strong>Source Name:</strong>
          </p>
          <p>{sign.sourceName}</p>

          <video
            className="dictionary-detail-video"
            src={sign.videoUrl}
            controls
            playsInline
          />
        </div>
      )}
    </div>
  );
}

export default DictionaryDetail;