import { useCallback, useEffect, useRef, useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import { getDictionarySigns } from "../../api/dictionary.api";

import DictionaryCard from "./DictionaryCard";
import DictionaryDetail from "./DictionaryDetail";

import "../../styles/Dictionary/Dictionary.style.css";

function DictionaryPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [signs, setSigns] = useState([]);
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedSignId, setSelectedSignId] = useState(null);

  // Ignore responses that belong to an older search
  const requestIdRef = useRef(0);

  const fetchSigns = useCallback(
    async (pageNumber, replace = false) => {
      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);

        const data = await getDictionarySigns({
          page: pageNumber,
          limit: 20,
          search: debouncedSearch,
        });

        if (requestId !== requestIdRef.current) return;

        setSigns((previousSigns) => (replace ? data.signs : [...previousSigns, ...data.signs]));
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error(error.response?.data?.message || "Failed to load dictionary");
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    setSigns([]);
    setPage(1);
    setHasMore(true);

    fetchSigns(1, true);
  }, [fetchSigns]);

  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;
    fetchSigns(page + 1);
  }, [loading, hasMore, page, fetchSigns]);

  const sentinelRef = useInfiniteScroll(loadNextPage, hasMore, loading);

  const closeDetail = useCallback(() => setSelectedSignId(null), []);

  const searching = debouncedSearch.trim().length > 0;

  return (
    <section className="ui-scope ui-page dc-page">
      <div className="ui-wrap">
        <header className="dc-head">
          <h1>Dictionary</h1>
          <p>Search for a sign, then open it to watch the video and read how it is used.</p>
        </header>

        <div className="dc-search">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>

          <input
            type="search"
            className="dc-search-input"
            placeholder="Search for a sign, like Water or Thank you"
            aria-label="Search signs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dc-list">
          {signs.map((sign) => (
            <DictionaryCard key={sign._id} sign={sign} onClick={setSelectedSignId} />
          ))}
        </div>

        {loading && signs.length === 0 && (
          <div className="dc-list" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="ui-skel dc-skel-card" />
            ))}
          </div>
        )}

        {loading && signs.length > 0 && (
          <div className="dc-more">
            <div className="ui-spinner" role="status" aria-label="Loading more signs" />
          </div>
        )}

        {!loading && signs.length === 0 && (
          <div className="ui-empty dc-empty">
            <p>
              {searching
                ? `No signs match "${debouncedSearch.trim()}". Check the spelling or try a shorter word.`
                : "The dictionary is empty for now."}
            </p>
          </div>
        )}

        <div ref={sentinelRef} className="dc-sentinel" />
      </div>

      {selectedSignId && <DictionaryDetail signId={selectedSignId} onClose={closeDetail} />}
    </section>
  );
}

export default DictionaryPage;
