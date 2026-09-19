import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {getMyProfile,updateMyProfile} from "../../api/profile.api";
import defaultAvatar from "../../assets/default_avatar.avif";

import "../../styles/Profile/ProfilePage.style.css";

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    mobileNo: "",
    profilePic: null,
  });

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
        setMessage(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    setForm((previous) => ({
      ...previous,
      profilePic: e.target.files[0] || null,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("emailId", form.emailId);
      formData.append("mobileNo", form.mobileNo);

      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }

      const data = await updateMyProfile(formData);

      setProfile(data.profile);

      setForm({
        fullName: data.profile.fullName,
        emailId: data.profile.emailId,
        mobileNo: data.profile.mobileNo,
        profilePic: null,
      });

      setIsEditing(false);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-overlay">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-overlay">
        <p>{message || "Failed to load profile"}</p>
      </div>
    );
  }

  return (
    <div className="profile-overlay">
      <div className="profile-content">

        {/* Back Button */}
        <button 
          type="button" 
          className="back-btn" 
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {!isEditing ? (
          <>
            <img
              className="profile-picture"
              src={profile.profilePic || defaultAvatar}
              alt="Profile"
            />

            <p>
              <strong>Username:</strong>{" "}
              {profile.username}
            </p>

            <p>
              <strong>Full Name:</strong>{" "}
              {profile.fullName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {profile.emailId}
            </p>

            <p>
              <strong>Mobile No:</strong>{" "}
              {profile.mobileNo}
            </p>

            <div className="profile-scores">
              <h2>Module Scores</h2>

              {profile.moduleScores.map((score) => (
                <div
                  className="module-score"
                  key={score.moduleNumber}
                >
                  <p>
                    <strong>Module:</strong>{" "}
                    {score.moduleNumber}
                  </p>

                  <p>
                    <strong>Best Score:</strong>{" "}
                    {score.bestScore}
                  </p>

                  <p>
                    <strong>Last Attempted:</strong>{" "}
                    {new Date(
                      score.lastAttemptedAt
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <img
              className="profile-picture"
              src={
                form.profilePic
                  ? URL.createObjectURL(form.profilePic)
                  : profile.profilePic || defaultAvatar
              }
              alt="Profile"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />

            <label>Username</label>

            <input
              type="text"
              value={profile.username}
              disabled
            />

            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <label>Email</label>

            <input
              type="email"
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              required
            />

            <label>Mobile No</label>

            <input
              type="text"
              name="mobileNo"
              value={form.mobileNo}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;