import { useCallback, useEffect, useState } from "react";

import { getContribution } from "../../api/contribution.api";

function ContributionDetail({ contributionId, onClose }) {
  const [contribution, setContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadContribution = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const data = await getContribution(contributionId);

        setContribution(data.contribution);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load contribution.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [contributionId]
  );

  useEffect(() => {
    loadContribution();
  }, [loadContribution]);

  if (loading) {
    return (
      <div className="ui-scope ui-overlay ct-center">
        <div className="ui-spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="ui-scope ui-overlay ct-center">
        <div className="ct-stack">
          <p className="ui-alert">{error || "Contribution not found."}</p>
          <button type="button" className="ui-btn" onClick={onClose}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const feedbackTone = contribution.status === "rejected" ? "is-rejected" : contribution.status === "approved" ? "is-approved" : "";

  return (
    <div className="ui-scope ui-overlay">
      <div className="ct-detail">
        <div className="ct-topbar">
          <button type="button" onClick={onClose} className="ui-back">
            Back
          </button>

          <button type="button" className="ui-btn ui-btn--sm" onClick={() => loadContribution(true)} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <p className="ui-alert">{error}</p>}

        <header className="ct-detail-head">
          <span className={`ui-badge is-${contribution.status}`}>{contribution.status}</span>
          <h1>{contribution.signName}</h1>
          {contribution.createdAt && (
            <p className="ct-muted">Submitted {new Date(contribution.createdAt).toLocaleString()}</p>
          )}
        </header>

        <video className="ui-video" src={contribution.videoUrl} controls playsInline />

        <div className="ct-sections">
          {contribution.description && (
            <section>
              <h3>Why this sign</h3>
              <p>{contribution.description}</p>
            </section>
          )}

          <section>
            <h3>Meaning</h3>
            <p>{contribution.meaning}</p>
          </section>

          <section>
            <h3>Usage</h3>
            <p>{contribution.usage}</p>
          </section>

          {contribution.example && (
            <section>
              <h3>Example</h3>
              <p>{contribution.example}</p>
            </section>
          )}
        </div>

        <section className={`ct-review ${feedbackTone}`}>
          <h3>Moderator review</h3>
          <p>{contribution.moderatorFeedback || "A moderator has not reviewed this yet."}</p>
        </section>
      </div>
    </div>
  );
}

export default ContributionDetail;
