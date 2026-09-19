import { useCallback, useEffect, useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import {getDictionarySigns} from "../../api/dictionary.api";

import DictionaryCard from "./DictionaryCard";
import DictionaryDetail from "./DictionaryDetail";

import "../../styles/Dictionary/Dictionary.style.css";

function DictionaryPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [signs, setSigns] = useState([]);
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedSignId, setSelectedSignId] = useState(null);

  const fetchSigns = useCallback(
    async (pageNumber, replace = false) => {
      try {
        setLoading(true);

        const data = await getDictionarySigns({
          page: pageNumber,
          limit: 20,
          search: debouncedSearch,
        });

        setSigns((previousSigns) =>
          replace
            ? data.signs
            : [...previousSigns, ...data.signs]
        );

        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error(
          error.response?.data?.message ||
            "Failed to load dictionary"
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    setSigns([]);
    setPage(1);
    setHasMore(true);

    fetchSigns(1, true);
  }, [debouncedSearch, fetchSigns]);

  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;

    fetchSigns(page + 1);
  }, [loading, hasMore, page, fetchSigns]);

  const sentinelRef = useInfiniteScroll(
    loadNextPage,
    hasMore,
    loading
  );

  return (
    <section className="dictionary-page">
      <h1>Dictionary</h1>

      <input
        type="text"
        className="dictionary-search"
        placeholder="Search sign..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="dictionary-list">
        {signs.map((sign) => (
          <DictionaryCard
            key={sign._id}
            sign={sign}
            onClick={setSelectedSignId}
          />
        ))}
      </div>

      {loading && (
        <p className="dictionary-loading">
          Loading...
        </p>
      )}

      {!loading && signs.length === 0 && (
        <p className="dictionary-empty">
          No signs found.
        </p>
      )}

      <div
        ref={sentinelRef}
        className="dictionary-sentinel"
      />

      {selectedSignId && (
        <DictionaryDetail
          signId={selectedSignId}
          onClose={() => setSelectedSignId(null)}
        />
      )}
    </section>
  );
}

export default DictionaryPage;