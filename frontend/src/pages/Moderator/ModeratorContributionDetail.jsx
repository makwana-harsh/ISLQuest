import { useEffect, useState } from "react";

import {
  getModeratorContribution,
  reviewModeratorContribution,
  blockUser,
  unblockUser,
} from "../../api/moderator.api";

function ModeratorContributionDetail({
  contributionId,
  onClose,
  onUpdated,
}) {
  const [contribution, setContribution] =
    useState(null);

  const [form, setForm] = useState({
    signName: "",
    description: "",
    meaning: "",
    usage: "",
    moderatorFeedback: "",
  });

  const [blockedDate, setBlockedDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [blocking, setBlocking] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadContribution = async () => {
    try {
      setLoading(true);

      const data =
        await getModeratorContribution(
          contributionId
        );

      const item = data.contribution;

      setContribution(item);

      setForm({
        signName: item.signName || "",
        description:
          item.description || "",
        meaning: item.meaning || "",
        usage: item.usage || "",
        moderatorFeedback:
          item.moderatorFeedback || "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load contribution."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContribution();
  }, [contributionId]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleReview = async (status) => {
    try {
      setSaving(true);
      setError("");

      await reviewModeratorContribution(
        contributionId,
        {
          ...form,
          status,
        }
      );

      onUpdated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update contribution."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBlock = async () => {
    if (!blockedDate) {
      setError(
        "Please select a block date."
      );
      return;
    }

    try {
      setBlocking(true);
      setError("");

      const blockedUntil =
        new Date(
          `${blockedDate}T23:59:59`
        ).toISOString();

      await blockUser(
        contribution.userId.mobileNo,
        blockedUntil
      );

      await loadContribution();

      setBlockedDate("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to block user."
      );
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setBlocking(true);
      setError("");

      await unblockUser(
        contribution.userId.mobileNo
      );

      await loadContribution();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to unblock user."
      );
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="moderator-detail-overlay">
        <p>Loading...</p>
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="moderator-detail-overlay">
        <p>{error}</p>

        <button onClick={onClose}>
          Back
        </button>
      </div>
    );
  }

  const user = contribution.userId;

  return (
    <div className="moderator-detail-overlay">

      <div className="moderator-detail">

        <div className="moderator-detail-header">

          <button
            type="button"
            onClick={onClose}
          >
            ← Back
          </button>

          <strong>
            {contribution.status}
          </strong>

        </div>

        {error && (
          <p className="moderator-error">
            {error}
          </p>
        )}

        <h1>
          Contribution Review
        </h1>

        {/* VIDEO */}

        <div className="moderator-video">
          <video
            src={contribution.videoUrl}
            controls
            playsInline
          />
        </div>

        {/* SIGN INFORMATION */}

        <label>
          Sign Name

          <input
            name="signName"
            value={form.signName}
            onChange={handleChange}
          />
        </label>

        <label>
          Description

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Meaning

          <textarea
            name="meaning"
            value={form.meaning}
            onChange={handleChange}
          />
        </label>

        <label>
          Usage

          <textarea
            name="usage"
            value={form.usage}
            onChange={handleChange}
          />
        </label>

        {/* USER INFORMATION */}

        <section>
          <h2>
            User Information
          </h2>

          <p>
            Username: {user?.username}
          </p>

          <p>
            Email: {user?.emailId}
          </p>

          <p>
            Mobile: {user?.mobileNo}
          </p>

          <p>
            Uploaded:{" "}
            {new Date(
              contribution.createdAt
            ).toLocaleString()}
          </p>
        </section>

        {/* LLM REVIEW */}

        <section>
          <h2>
            LLM Review
          </h2>

          <p>
            Suitable:{" "}
            {contribution.llmReview?.approved
              ? "Yes"
              : "No"}
          </p>

          {contribution.llmReview?.issues
            ?.length > 0 && (
            <ul>
              {contribution.llmReview.issues.map(
                (issue, index) => (
                  <li key={index}>
                    {issue}
                  </li>
                )
              )}
            </ul>
          )}

          {contribution.llmReview
            ?.suggestion && (
            <p>
              Suggestion:{" "}
              {
                contribution.llmReview
                  .suggestion
              }
            </p>
          )}
        </section>

        {/* MODERATOR FEEDBACK */}

        <label>
          Moderator Feedback / Warning

          <textarea
            name="moderatorFeedback"
            value={
              form.moderatorFeedback
            }
            onChange={handleChange}
            placeholder="Feedback or warning for the user"
          />
        </label>

        {/* BLOCK USER */}

        <section className="user-block-section">

          <h2>
            User Block
          </h2>

          <p>
            This will affect all accounts
            using this mobile number.
          </p>

          <p>
            Mobile:{" "}
            <strong>
              {user?.mobileNo}
            </strong>
          </p>

          {user?.isBlocked ? (
            <>
              <p>
                Blocked until:{" "}
                {user.blockedUntil
                  ? new Date(
                      user.blockedUntil
                    ).toLocaleString()
                  : "Unknown"}
              </p>

              <button
                type="button"
                onClick={handleUnblock}
                disabled={blocking}
              >
                {blocking
                  ? "Unblocking..."
                  : "Unblock User"}
              </button>
            </>
          ) : (
            <>
              <label>
                Block Until

                <input
                  type="date"
                  value={blockedDate}
                  onChange={(e) =>
                    setBlockedDate(
                      e.target.value
                    )
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </label>

              <button
                type="button"
                onClick={handleBlock}
                disabled={blocking}
              >
                {blocking
                  ? "Blocking..."
                  : "Block User"}
              </button>
            </>
          )}

        </section>

        {/* ACTIONS */}

        <div className="moderator-actions">

          <button
            type="button"
            onClick={() =>
              handleReview("approved")
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Accept"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleReview("rejected")
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Reject"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ModeratorContributionDetail;