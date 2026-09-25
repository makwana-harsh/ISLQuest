import { useCallback, useEffect, useState } from "react";

import {
  getModeratorContribution,
  reviewModeratorContribution,
  blockUser,
  unblockUser,
} from "../../api/moderator.api";

function ModeratorContributionDetail({ contributionId, onClose, onUpdated }) {
  const [contribution, setContribution] = useState(null);

  const [form, setForm] = useState({
    signName: "",
    description: "",
    meaning: "",
    usage: "",
    moderatorFeedback: "",
  });

  const [blockedDate, setBlockedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(null); // "approved" | "rejected" | null
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState("");

  const loadContribution = useCallback(async () => {
    try {
      const data = await getModeratorContribution(contributionId);
      const item = data.contribution;

      setContribution(item);
      setForm({
        signName: item.signName || "",
        description: item.description || "",
        meaning: item.meaning || "",
        usage: item.usage || "",
        moderatorFeedback: item.moderatorFeedback || "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load contribution.");
    }
  }, [contributionId]);

  useEffect(() => {
    setLoading(true);
    loadContribution().finally(() => setLoading(false));
  }, [loadContribution]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleReview = async (status) => {
    try {
      setSavingStatus(status);
      setError("");

      await reviewModeratorContribution(contributionId, { ...form, status });

      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update contribution.");
      setSavingStatus(null);
    }
  };

  const handleBlock = async () => {
    if (!blockedDate) {
      setError("Please select a block date.");
      return;
    }

    try {
      setBlocking(true);
      setError("");

      const blockedUntil = new Date(`${blockedDate}T23:59:59`).toISOString();

      await blockUser(contribution.userId.mobileNo, blockedUntil);
      await loadContribution();

      setBlockedDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to block user.");
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setBlocking(true);
      setError("");

      await unblockUser(contribution.userId.mobileNo);
      await loadContribution();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unblock user.");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="ui-scope ui-overlay md-center">
        <div className="ui-spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="ui-scope ui-overlay md-center">
        <div className="md-stack">
          <p className="ui-alert">{error || "Contribution not found."}</p>
          <button type="button" className="ui-btn" onClick={onClose}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const user = contribution.userId;
  const busy = savingStatus !== null || blocking;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="ui-scope ui-overlay">
      <div className="md-detail">
        <div className="md-detail-top">
          <button type="button" className="ui-back" onClick={onClose}>
            Back
          </button>
          <span className={`ui-badge is-${contribution.status}`}>{contribution.status}</span>
        </div>

        <h1 className="md-detail-title">Review contribution</h1>

        {error && (
          <p className="ui-alert" role="alert">
            {error}
          </p>
        )}

        <div className="md-detail-grid">
          {/* left column: evidence */}
          <div className="md-col">
            <video className="ui-video" src={contribution.videoUrl} controls playsInline />

            <section className="md-panel">
              <h2>Contributor</h2>
              <dl className="md-facts">
                <div>
                  <dt>Username</dt>
                  <dd>{user?.username || "Unknown"}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.emailId || "Unknown"}</dd>
                </div>
                <div>
                  <dt>Mobile</dt>
                  <dd>{user?.mobileNo || "Unknown"}</dd>
                </div>
                <div>
                  <dt>Uploaded</dt>
                  <dd>{new Date(contribution.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
            </section>

            <section className={`md-panel md-llm ${contribution.llmReview?.approved ? "is-ok" : "is-flag"}`}>
              <h2>Automatic check</h2>
              <p className="md-llm-verdict">
                {contribution.llmReview?.approved ? "Looks suitable" : "Flagged as not suitable"}
              </p>

              {contribution.llmReview?.issues?.length > 0 && (
                <ul>
                  {contribution.llmReview.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              )}

              {contribution.llmReview?.suggestion && <p>Suggestion: {contribution.llmReview.suggestion}</p>}
            </section>
          </div>

          {/* right column: editable details */}
          <div className="md-col">
            <section className="md-panel md-form">
              <h2>Sign details</h2>

              <label className="ui-field">
                Sign name
                <input className="ui-input" name="signName" value={form.signName} onChange={handleChange} />
              </label>

              <label className="ui-field">
                Description
                <textarea className="ui-textarea" name="description" value={form.description} onChange={handleChange} />
              </label>

              <label className="ui-field">
                Meaning
                <textarea className="ui-textarea" name="meaning" value={form.meaning} onChange={handleChange} />
              </label>

              <label className="ui-field">
                Usage
                <textarea className="ui-textarea" name="usage" value={form.usage} onChange={handleChange} />
              </label>

              {contribution.example && (
                <div className="md-readonly">
                  <span>Example from contributor</span>
                  <p>{contribution.example}</p>
                </div>
              )}

              <label className="ui-field">
                Feedback or warning for the user
                <textarea
                  className="ui-textarea"
                  name="moderatorFeedback"
                  value={form.moderatorFeedback}
                  onChange={handleChange}
                  placeholder="Tell the contributor why you accepted or rejected this."
                />
              </label>
            </section>

            <section className="md-panel md-block">
              <h2>Block this user</h2>
              <p className="md-muted">
                Blocking applies to every account that uses the mobile number <strong>{user?.mobileNo || "unknown"}</strong>.
              </p>

              {!user ? (
                <p className="md-muted">User details are not available for this contribution.</p>
              ) : user.isBlocked ? (
                <>
                  <p className="ui-alert">
                    Blocked until {user.blockedUntil ? new Date(user.blockedUntil).toLocaleString() : "an unknown date"}
                  </p>
                  <button type="button" className="ui-btn ui-btn--sm" onClick={handleUnblock} disabled={busy}>
                    {blocking ? "Unblocking..." : "Unblock user"}
                  </button>
                </>
              ) : (
                <div className="md-block-row">
                  <label className="ui-field">
                    Block until
                    <input
                      className="ui-input"
                      type="date"
                      value={blockedDate}
                      min={today}
                      onChange={(e) => setBlockedDate(e.target.value)}
                    />
                  </label>

                  <button type="button" className="ui-btn ui-btn--sm ui-btn--danger" onClick={handleBlock} disabled={busy}>
                    {blocking ? "Blocking..." : "Block user"}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="md-actions">
          <button type="button" className="ui-btn ui-btn--danger" onClick={() => handleReview("rejected")} disabled={busy}>
            {savingStatus === "rejected" ? "Rejecting..." : "Reject"}
          </button>

          <button type="button" className="ui-btn ui-btn--primary" onClick={() => handleReview("approved")} disabled={busy}>
            {savingStatus === "approved" ? "Accepting..." : "Accept sign"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeratorContributionDetail;
