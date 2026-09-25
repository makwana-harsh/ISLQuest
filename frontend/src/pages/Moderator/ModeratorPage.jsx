import { useCallback, useEffect, useRef, useState } from "react";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { getModeratorContributions } from "../../api/moderator.api";

import ModeratorContributionDetail from "./ModeratorContributionDetail";

import "../../styles/Moderator/Moderator.css";

function RequestList({ title, hint, items, loading, emptyText, onRefresh, onSelect, sentinelRef }) {
  return (
    <section className="md-box">
      <div className="md-box-head">
        <div>
          <h2>{title}</h2>
          <p>{hint}</p>
        </div>

        <button type="button" className="ui-btn ui-btn--sm" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="md-list">
        {items.map((item) => (
          <button type="button" key={item._id} className="md-card" onClick={() => onSelect(item._id)}>
            <span className="md-card-main">
              <strong>{item.signName}</strong>
              <span>@{item.userId?.username || "unknown"}</span>
            </span>
            <span className="md-card-side">
              <span className={`ui-badge is-${item.status}`}>{item.status}</span>
              <time>{new Date(item.createdAt).toLocaleString()}</time>
            </span>
          </button>
        ))}

        {!loading && items.length === 0 && (
          <div className="ui-empty">
            <p>{emptyText}</p>
          </div>
        )}

        {loading && (
          <div className="md-loading">
            <div className="ui-spinner" role="status" aria-label="Loading" />
          </div>
        )}

        <div ref={sentinelRef} className="md-sentinel" />
      </div>
    </section>
  );
}

function ModeratorPage() {
  // Prevent duplicate initial API calls (React StrictMode runs effects twice in dev)
  const initialLoadRef = useRef(false);

  // Synchronous request locks
  const incomingLoadingRef = useRef(false);
  const seenLoadingRef = useRef(false);

  // Cursors stored in refs so the latest value is always used
  const incomingCursorRef = useRef(null);
  const seenCursorRef = useRef(null);

  const [incoming, setIncoming] = useState([]);
  const [seen, setSeen] = useState([]);

  const [incomingHasMore, setIncomingHasMore] = useState(true);
  const [seenHasMore, setSeenHasMore] = useState(true);

  const [incomingLoading, setIncomingLoading] = useState(false);
  const [seenLoading, setSeenLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const mergeUnique = (previous, next) => {
    const existingIds = new Set(previous.map((item) => item._id));
    return [...previous, ...next.filter((item) => !existingIds.has(item._id))];
  };

  // ----- incoming -----
  const loadIncoming = useCallback(
    async (reset = false) => {
      if (incomingLoadingRef.current || (!reset && !incomingHasMore)) return;

      incomingLoadingRef.current = true;
      setIncomingLoading(true);

      try {
        const data = await getModeratorContributions({
          status: "pending",
          cursor: reset ? null : incomingCursorRef.current,
        });

        setIncoming((prev) => (reset ? data.contributions : mergeUnique(prev, data.contributions)));

        incomingCursorRef.current = data.nextCursor;
        setIncomingHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to load incoming requests:", error);
      } finally {
        incomingLoadingRef.current = false;
        setIncomingLoading(false);
      }
    },
    [incomingHasMore]
  );

  // ----- seen -----
  const loadSeen = useCallback(
    async (reset = false) => {
      if (seenLoadingRef.current || (!reset && !seenHasMore)) return;

      seenLoadingRef.current = true;
      setSeenLoading(true);

      try {
        const data = await getModeratorContributions({
          status: "seen",
          cursor: reset ? null : seenCursorRef.current,
        });

        setSeen((prev) => (reset ? data.contributions : mergeUnique(prev, data.contributions)));

        seenCursorRef.current = data.nextCursor;
        setSeenHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to load seen requests:", error);
      } finally {
        seenLoadingRef.current = false;
        setSeenLoading(false);
      }
    },
    [seenHasMore]
  );

  const refreshIncoming = () => {
    incomingCursorRef.current = null;
    setIncomingHasMore(true);
    incomingLoadingRef.current = false;
    loadIncoming(true);
  };

  const refreshSeen = () => {
    seenCursorRef.current = null;
    setSeenHasMore(true);
    seenLoadingRef.current = false;
    loadSeen(true);
  };

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    loadIncoming();
    loadSeen();
  }, [loadIncoming, loadSeen]);

  const incomingSentinel = useInfiniteScroll(loadIncoming, incomingHasMore, incomingLoading);
  const seenSentinel = useInfiniteScroll(loadSeen, seenHasMore, seenLoading);

  return (
    <div className="ui-scope ui-page md-page">
      <div className="ui-wrap">
        <header className="md-head">
          <h1>Moderator</h1>
          <p>Review new sign contributions, edit the details if needed, then accept or reject them.</p>
        </header>

        <div className="md-columns">
          <RequestList
            title="Incoming requests"
            hint="Waiting for a decision"
            items={incoming}
            loading={incomingLoading}
            emptyText="Nothing is waiting for review right now."
            onRefresh={refreshIncoming}
            onSelect={setSelectedId}
            sentinelRef={incomingSentinel}
          />

          <RequestList
            title="Seen requests"
            hint="Already opened by a moderator"
            items={seen}
            loading={seenLoading}
            emptyText="No requests have been seen yet."
            onRefresh={refreshSeen}
            onSelect={setSelectedId}
            sentinelRef={seenSentinel}
          />
        </div>
      </div>

      {selectedId && (
        <ModeratorContributionDetail
          contributionId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={() => {
            setSelectedId(null);
            // Refresh both lists once a decision is saved
            refreshIncoming();
            refreshSeen();
          }}
        />
      )}
    </div>
  );
}

export default ModeratorPage;
