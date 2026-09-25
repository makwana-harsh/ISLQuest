import { useCallback, useEffect, useState } from "react";

import { getContributions } from "../../api/contribution.api";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import ContributionForm from "./ContributionForm";
import ContributionDetail from "./ContributionDetail";

import "../../styles/Contribute/Contribute.style.css";

const GUIDELINES = [
  "Upload only content related to Indian Sign Language.",
  "Record in good lighting with your hands and movements clearly visible.",
  "Keep the camera stable and the video between 3 and 8 seconds.",
  "Avoid blurry, dark or extremely noisy videos.",
  "The sign name, meaning and usage must match the sign you show.",
  "Do not upload abusive, hateful, inappropriate or unrelated content.",
  "Submit only content that you have the right to contribute.",
];

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

      setContributions((prev) => (isInitial ? data.contributions : [...prev, ...data.contributions]));
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
    setHasMore(true);
    await fetchContributions(1, true);
  };

  // 1. Full-screen form
  if (showForm) {
    return <ContributionForm onBack={() => setShowForm(false)} onSubmitted={handleResetAndReload} />;
  }

  // 2. Full-screen contribution detail
  if (selectedContribution) {
    return <ContributionDetail contributionId={selectedContribution} onClose={() => setSelectedContribution(null)} />;
  }

  // 3. Main page
  return (
    <div className="ui-scope ui-page ct-page">
      <div className="ui-wrap">
        <section className="ct-hero">
          <div className="ct-hero-copy">
            <h1>Know a sign that is missing? Add it.</h1>
            <p>
              Every sign you record helps someone else learn and communicate. A moderator checks each one before it
              reaches the dictionary.
            </p>
            <button type="button" className="ui-btn ui-btn--primary ct-cta" onClick={() => setShowForm(true)}>
              Contribute a sign
            </button>
          </div>

          <aside className="ct-guide">
            <h2>Before you record</h2>
            <ul>
              {GUIDELINES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="ct-box" aria-labelledby="ct-box-title">
          <div className="ct-box-head">
            <h2 id="ct-box-title">Your contributions</h2>
            <button
              type="button"
              className="ui-btn ui-btn--sm"
              onClick={handleResetAndReload}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="ct-scroll">
            {contributions.length === 0 && !loading ? (
              <div className="ui-empty">
                <p>You have not submitted anything yet. Your first contribution will show up here.</p>
              </div>
            ) : (
              <div className="ct-grid">
                {contributions.map((item) => (
                  <button
                    type="button"
                    key={item._id}
                    className="ct-card"
                    onClick={() => setSelectedContribution(item._id)}
                  >
                    <strong>{item.signName}</strong>
                    <span className="ct-card-date">{new Date(item.createdAt).toLocaleString()}</span>
                    <span className={`ui-badge is-${item.status}`}>{item.status}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="ct-sentinel">
              {loading && <div className="ui-spinner" role="status" aria-label="Loading" />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContributePage;
