import { useEffect, useState } from "react";

import {
  getContribution,
} from "../../api/contribution.api";

function ContributionDetail({
  contributionId,
  onClose,
}) {
  const [contribution, setContribution] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadContribution = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data =
        await getContribution(
          contributionId
        );

      setContribution(
        data.contribution
      );

      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load contribution."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContribution();
  }, [contributionId]);

  if (loading) {
    return (
      <div className="contribution-detail-overlay">
        <p>Loading...</p>
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="contribution-detail-overlay">
        <p>{error}</p>

        <button onClick={onClose}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="contribution-detail-overlay">

      <div className="contribution-detail">

        <div className="detail-topbar">

          <button
            onClick={onClose}
            className="back-button"
          >
            ← Back
          </button>

          <button
            onClick={() =>
              loadContribution(true)
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {error && (
          <p className="contribute-error">
            {error}
          </p>
        )}

        <span
          className={`status ${contribution.status}`}
        >
          {contribution.status}
        </span>

        <h1>
          {contribution.signName}
        </h1>

        <div className="contribution-video">

          <video
            src={contribution.videoUrl}
            controls
            playsInline
          />

        </div>

        {contribution.description && (
          <section>
            <h3>Description</h3>
            <p>
              {contribution.description}
            </p>
          </section>
        )}

        <section>
          <h3>Meaning</h3>
          <p>
            {contribution.meaning}
          </p>
        </section>

        <section>
          <h3>Usage</h3>
          <p>
            {contribution.usage}
          </p>
        </section>

        {contribution.example && (
          <section>
            <h3>Example</h3>
            <p>
              {contribution.example}
            </p>
          </section>
        )}

        <section>
          <h3>Moderator Review</h3>

          {contribution.moderatorFeedback ? (
            <p>
              {contribution.moderatorFeedback}
            </p>
          ) : (
            <p>
              Moderator review is not available yet.
            </p>
          )}
        </section>

      </div>

    </div>
  );
}

export default ContributionDetail;