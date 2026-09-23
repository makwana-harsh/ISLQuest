import { useEffect, useState, useCallback } from "react";

import { getContributions } from "../../api/contribution.api";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import ContributionForm from "./ContributionForm";
import ContributionDetail from "./ContributionDetail";

import "../../styles/Contribute/Contribute.style.css";

function ContributePage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const [contributions, setContributions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchContributions = async (pageNum, isInitial = false) => {
    try {
      setLoading(true);
      const data = await getContributions(pageNum, 6);

      setContributions((prev) =>
        isInitial ? data.contributions : [...prev, ...data.contributions]
      );
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(1, true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchContributions(nextPage);
    }
  }, [loading, hasMore, page]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleResetAndReload = async () => {
    setShowForm(false);
    setPage(1);
    await fetchContributions(1, true);
  };

  // 1. Show Form as full-screen view
  if (showForm) {
    return (
      <ContributionForm
        onBack={() => setShowForm(false)}
        onSubmitted={handleResetAndReload}
      />
    );
  }

  // 2. Show Selected Contribution Detail as full-screen view (replaces the main screen)
  if (selectedContribution) {
    return (
      <ContributionDetail
        contributionId={selectedContribution}
        onClose={() => setSelectedContribution(null)}
      />
    );
  }

  // 3. Main Page
  return (
    <div className="contribute-page">
      <div className="contribute-intro">
        <h1>Contribute to ISL</h1>
        <p>
          Help us expand the Indian Sign Language dictionary by contributing
          useful and meaningful signs.
        </p>
      </div>

      <div className="contribute-guidelines">
        <h2>Before You Contribute</h2>
        <ul>
          <li>Upload only content related to Indian Sign Language.</li>
          <li>Record the video in good lighting.</li>
          <li>Make sure your hands and movements are clearly visible.</li>
          <li>Keep the camera stable while recording.</li>
          <li>Record a video between 3 and 8 seconds.</li>
          <li>Avoid blurry, dark or extremely noisy videos.</li>
          <li>The sign name must accurately describe the sign.</li>
          <li>Meaning and usage must be related to the submitted sign.</li>
          <li>Do not upload abusive, hateful, inappropriate or unrelated content.</li>
          <li>Submit only content that you have the right to contribute.</li>
        </ul>
      </div>

      <button
        className="contribute-button"
        onClick={() => setShowForm(true)}
      >
        Click here to contribute
      </button>

      {/* Container Box for User Applications */}
      <div className="contributions-box">
        <div className="contributions-box-header">
          <h2>Your Contributions</h2>
          <button
            className="refresh-button"
            onClick={handleResetAndReload}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="contributions-scroll-container">
          {contributions.length === 0 && !loading ? (
            <p>You have not submitted any contributions yet.</p>
          ) : (
            <div className="contribution-grid">
              {contributions.map((item) => (
                <button
                  key={item._id}
                  className="contribution-card"
                  onClick={() => setSelectedContribution(item._id)}
                >
                  <strong>{item.signName}</strong>
                  <span>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                  <span className={`status ${item.status}`}>
                    {item.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="scroll-sentinel">
            {loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributePage;