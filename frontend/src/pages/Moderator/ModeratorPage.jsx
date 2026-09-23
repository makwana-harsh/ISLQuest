import { useCallback, useEffect, useRef, useState } from "react";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import { getModeratorContributions } from "../../api/moderator.api";

import ModeratorContributionDetail from "./ModeratorContributionDetail";

import "../../styles/Moderator/Moderator.css";

function ModeratorPage() {
  // Prevent duplicate initial API calls
  const initialLoadRef = useRef(false);

  // Synchronous request locks
  const incomingLoadingRef = useRef(false);
  const seenLoadingRef = useRef(false);

  // Cursors stored in refs
  const incomingCursorRef = useRef(null);
  const seenCursorRef = useRef(null);

  const [incoming, setIncoming] = useState([]);
  const [seen, setSeen] = useState([]);

  const [incomingCursor, setIncomingCursor] = useState(null);
  const [seenCursor, setSeenCursor] = useState(null);

  const [incomingHasMore, setIncomingHasMore] = useState(true);
  const [seenHasMore, setSeenHasMore] = useState(true);

  const [incomingLoading, setIncomingLoading] = useState(false);
  const [seenLoading, setSeenLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  // -----------------------------
  // LOAD INCOMING REQUESTS
  // -----------------------------
  const loadIncoming = useCallback(async (reset = false) => {
    if (incomingLoadingRef.current || (!reset && !incomingHasMore)) {
      return;
    }

    incomingLoadingRef.current = true;
    setIncomingLoading(true);

    try {
      const activeCursor = reset ? null : incomingCursorRef.current;
      const data = await getModeratorContributions({
        status: "pending",
        cursor: activeCursor,
      });

      setIncoming((prev) => {
        if (reset) return data.contributions;

        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = data.contributions.filter(
          (item) => !existingIds.has(item._id)
        );
        return [...prev, ...newItems];
      });

      incomingCursorRef.current = data.nextCursor;
      setIncomingCursor(data.nextCursor);
      setIncomingHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to load incoming requests:", error);
    } finally {
      incomingLoadingRef.current = false;
      setIncomingLoading(false);
    }
  }, [incomingHasMore]);

  // -----------------------------
  // LOAD SEEN REQUESTS
  // -----------------------------
  const loadSeen = useCallback(async (reset = false) => {
    if (seenLoadingRef.current || (!reset && !seenHasMore)) {
      return;
    }

    seenLoadingRef.current = true;
    setSeenLoading(true);

    try {
      const activeCursor = reset ? null : seenCursorRef.current;
      const data = await getModeratorContributions({
        status: "seen",
        cursor: activeCursor,
      });

      setSeen((prev) => {
        if (reset) return data.contributions;

        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = data.contributions.filter(
          (item) => !existingIds.has(item._id)
        );
        return [...prev, ...newItems];
      });

      seenCursorRef.current = data.nextCursor;
      setSeenCursor(data.nextCursor);
      setSeenHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to load seen requests:", error);
    } finally {
      seenLoadingRef.current = false;
      setSeenLoading(false);
    }
  }, [seenHasMore]);

  // -----------------------------
  // INDIVIDUAL REFRESH HANDLERS
  // -----------------------------
  // Refreshes ONLY Incoming Requests box
  const refreshIncoming = () => {
    incomingCursorRef.current = null;
    setIncomingCursor(null);
    setIncomingHasMore(true);
    incomingLoadingRef.current = false;
    loadIncoming(true);
  };

  // Refreshes ONLY Seen Requests box
  const refreshSeen = () => {
    seenCursorRef.current = null;
    setSeenCursor(null);
    setSeenHasMore(true);
    seenLoadingRef.current = false;
    loadSeen(true);
  };

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    loadIncoming();
    loadSeen();
  }, [loadIncoming, loadSeen]);

  // -----------------------------
  // INFINITE SCROLL
  // -----------------------------
  const incomingSentinel = useInfiniteScroll(
    loadIncoming,
    incomingHasMore,
    incomingLoading
  );

  const seenSentinel = useInfiniteScroll(
    loadSeen,
    seenHasMore,
    seenLoading
  );

  return (
    <div className="moderator-page">
      <div className="moderator-box">
        <h1>Moderator</h1>

        {/* =========================
            INCOMING REQUESTS
        ========================== */}
        <section className="request-box">
          <div className="section-header">
            <h2>Incoming Requests</h2>
            <button
              className="refresh-button"
              onClick={refreshIncoming}
              disabled={incomingLoading}
            >
              {incomingLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="request-list">
            {incoming.map((item) => (
              <button
                key={item._id}
                className="request-card"
                onClick={() => setSelectedId(item._id)}
              >
                <strong>{item.signName}</strong>
                <span>@{item.userId?.username}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span className={`status ${item.status}`}>{item.status}</span>
              </button>
            ))}
          </div>

          {incomingLoading && <p className="loading-text">Loading...</p>}

          {!incomingLoading && incoming.length === 0 && (
            <p>No incoming requests.</p>
          )}

          <div ref={incomingSentinel} className="scroll-sentinel" />
        </section>

        {/* =========================
            SEEN REQUESTS
        ========================== */}
        <section className="request-box">
          <div className="section-header">
            <h2>Seen Requests</h2>
            <button
              className="refresh-button"
              onClick={refreshSeen}
              disabled={seenLoading}
            >
              {seenLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="request-list">
            {seen.map((item) => (
              <button
                key={item._id}
                className="request-card"
                onClick={() => setSelectedId(item._id)}
              >
                <strong>{item.signName}</strong>
                <span>@{item.userId?.username}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span className={`status ${item.status}`}>{item.status}</span>
              </button>
            ))}
          </div>

          {seenLoading && <p className="loading-text">Loading...</p>}

          {!seenLoading && seen.length === 0 && (
            <p>No seen requests.</p>
          )}

          <div ref={seenSentinel} className="scroll-sentinel" />
        </section>
      </div>

      {/* =========================
          FULL SCREEN DETAIL
      ========================== */}
      {selectedId && (
        <ModeratorContributionDetail
          contributionId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={() => {
            setSelectedId(null);
            // Refresh both lists when moderation details are saved
            refreshIncoming();
            refreshSeen();
          }}
        />
      )}
    </div>
  );
}

export default ModeratorPage;