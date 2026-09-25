import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProfile, updateMyProfile } from "../../api/profile.api";
import defaultAvatar from "../../assets/default_avatar.avif";

import "../../styles/Profile/ProfilePage.style.css";

function scoreLabel(score) {
  const value = Number(score) || 0;
  if (value >= 100) return "Mastery";
  if (value >= 80) return "Proficient";
  if (value >= 60) return "Good start";
  return "Needs practice";
}

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", kind: "error" });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    mobileNo: "",
    profilePic: null,
  });

  const [pickedPreview, setPickedPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        setProfile(data.profile);
        setForm({
          fullName: data.profile.fullName,
          emailId: data.profile.emailId,
          mobileNo: data.profile.mobileNo,
          profilePic: null,
        });
      } catch (error) {
        setMessage({ text: error.response?.data?.message || "Failed to load profile", kind: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Preview for a newly chosen picture (revoked when replaced or removed)
  useEffect(() => {
    if (!form.profilePic) {
      setPickedPreview(null);
      return undefined;
    }

    const url = URL.createObjectURL(form.profilePic);
    setPickedPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.profilePic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    setForm((previous) => ({ ...previous, profilePic: e.target.files?.[0] || null }));
  };

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/dashboard");
  };

  const startEditing = () => {
    setMessage({ text: "", kind: "error" });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm({
      fullName: profile.fullName,
      emailId: profile.emailId,
      mobileNo: profile.mobileNo,
      profilePic: null,
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ text: "", kind: "error" });

      const formData = new FormData();
      formData.append("fullName", form.fullName.trim());
      formData.append("emailId", form.emailId.trim());
      formData.append("mobileNo", form.mobileNo.trim());

      if (form.profilePic) formData.append("profilePic", form.profilePic);

      const data = await updateMyProfile(formData);

      setProfile(data.profile);
      setForm({
        fullName: data.profile.fullName,
        emailId: data.profile.emailId,
        mobileNo: data.profile.mobileNo,
        profilePic: null,
      });

      setIsEditing(false);
      setMessage({ text: "Your profile has been updated.", kind: "ok" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to update profile", kind: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ui-scope ui-page pf-page">
        <div className="pf-wrap">
          <div className="ui-skel pf-skel-hero" />
          <div className="ui-skel pf-skel-body" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="ui-scope ui-page pf-page">
        <div className="pf-wrap pf-center">
          <p className="ui-alert">{message.text || "Failed to load profile"}</p>
          <button type="button" className="ui-btn" onClick={goBack}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const moduleScores = profile.moduleScores ?? [];
  const avatar = pickedPreview || profile.profilePic || defaultAvatar;

  return (
    <div className="ui-scope ui-page pf-page">
      <div className="pf-wrap">
        <button type="button" className="ui-back" onClick={goBack}>
          Back
        </button>

        {message.text && (
          <p className={`ui-alert ${message.kind === "ok" ? "ui-alert--ok" : ""} pf-message`} role="status">
            {message.text}
          </p>
        )}

        {!isEditing ? (
          <>
            <section className="pf-hero">
              <img className="pf-avatar" src={avatar} alt="Your profile" />

              <div className="pf-hero-text">
                <h1>{profile.fullName}</h1>
                <p>@{profile.username}</p>
              </div>

              <button type="button" className="ui-btn" onClick={startEditing}>
                Edit profile
              </button>
            </section>

            <section className="pf-details">
              <div>
                <span>Email</span>
                <strong>{profile.emailId}</strong>
              </div>
              <div>
                <span>Mobile number</span>
                <strong>{profile.mobileNo}</strong>
              </div>
            </section>

            <section className="pf-scores">
              <h2>Module scores</h2>

              {moduleScores.length === 0 ? (
                <div className="ui-empty">
                  <p>You have not taken any quizzes yet. Finish a module quiz and your best score will appear here.</p>
                </div>
              ) : (
                <div className="pf-score-grid">
                  {moduleScores.map((score) => (
                    <article className="pf-score" key={score.moduleNumber}>
                      <div className="pf-score-top">
                        <h3>Module {score.moduleNumber}</h3>
                        <span className="pf-score-label">{scoreLabel(score.bestScore)}</span>
                      </div>

                      <div className="pf-bar" role="img" aria-label={`Best score ${score.bestScore} out of 100`}>
                        <span style={{ width: `${Math.max(0, Math.min(100, Number(score.bestScore) || 0))}%` }} />
                      </div>

                      <p>
                        Best score <strong>{score.bestScore}/100</strong>
                      </p>
                      {score.lastAttemptedAt && (
                        <p className="pf-when">Last attempt {new Date(score.lastAttemptedAt).toLocaleString()}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <form className="pf-form" onSubmit={handleSave}>
            <h1>Edit profile</h1>

            <div className="pf-photo">
              <img className="pf-avatar" src={avatar} alt="Profile preview" />

              <label className="ui-btn ui-btn--sm pf-file">
                Choose a new photo
                <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
              </label>
            </div>

            <label className="ui-field">
              Username
              <input className="ui-input" type="text" value={profile.username} disabled />
            </label>

            <label className="ui-field">
              Full name
              <input className="ui-input" type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>

            <label className="ui-field">
              Email
              <input className="ui-input" type="email" name="emailId" value={form.emailId} onChange={handleChange} required />
            </label>

            <label className="ui-field">
              Mobile number
              <input className="ui-input" type="tel" name="mobileNo" value={form.mobileNo} onChange={handleChange} required />
            </label>

            <div className="pf-form-actions">
              <button type="submit" className="ui-btn ui-btn--primary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="ui-btn" onClick={cancelEditing} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
