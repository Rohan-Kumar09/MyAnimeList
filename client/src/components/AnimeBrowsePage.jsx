import { useState, useEffect } from "react";
import AnimeModal from "./AnimeModal";
import { getUserInfo, getAnimeByIds, getAnimeByTitle } from "../api/FetchMethods";
import { useAnimeCache } from "../context/AnimeCacheContext";
import AnimeCard from "./AnimeCard";
import { useAuth } from "../context/AuthContext";
import { addAnimeToList, removeAnimeFromList } from "../api/UserModifyMethod";

export default function AnimeBrowsePage({ searchQuery = "" }) {
  const PAGE_SIZE = 25;
  const PAGE_WINDOW = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1); // start of current window (1, 8, 15, ...)
  const [animeDataList, setAnimeDataList] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]); // for search mode
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedAnimeIds, setSavedAnimeIds] = useState([]);
  const { cache, setCache } = useAnimeCache();
  const { user, token } = useAuth();

  // Helper to get anime IDs for a page
  const getAnimeIdsForPage = (page) => {
    const startId = (page - 1) * PAGE_SIZE + 1;
    return Array.from({ length: PAGE_SIZE }, (_, i) => startId + i);
  };

  // Helper to get search results for a page
  const getSearchResultsForPage = (page) => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return allSearchResults.slice(startIdx, startIdx + PAGE_SIZE);
  };

  // Fetch anime data for a page, with cache, or search results if searchQuery
  useEffect(() => {
    if (searchQuery) {
      // If searchQuery changes, reset paging and fetch all results
      setCurrentPage(1);
      setPageWindowStart(1);
      setAnimeDataList([]);
      setAllSearchResults([]);
      getAnimeByTitle(searchQuery).then(results => {
        setAllSearchResults(results || []);
        setAnimeDataList((results || []).slice(0, PAGE_SIZE));
      });
    }
    // eslint-disable-next-line
  }, [searchQuery]);

  // Update animeDataList when currentPage or allSearchResults changes (search mode)
  useEffect(() => {
    if (searchQuery && allSearchResults.length > 0) {
      setAnimeDataList(getSearchResultsForPage(currentPage));
    }
    // eslint-disable-next-line
  }, [currentPage, allSearchResults]);

  // Default: fetch by IDs (home page mode)
  useEffect(() => {
    if (!searchQuery) {
      const pageKey = `page_${currentPage}`;
      if (cache[pageKey]) {
        setAnimeDataList(cache[pageKey]);
      } else {
        const ids = getAnimeIdsForPage(currentPage);
        getAnimeByIds(ids).then(dataFetch => {
          setAnimeDataList(dataFetch);
          setCache(prevCache => ({ ...prevCache, [pageKey]: dataFetch }));
        });
      }
    }
    // eslint-disable-next-line
  }, [currentPage, cache, setCache, searchQuery]);

  // Fetch saved anime IDs for the user
  useEffect(() => {
    if (user && user.id) {
      getUserInfo(user.id, token).then(animeIdList => {
        setSavedAnimeIds(animeIdList.map(a => a.anime_id));
      }).catch(() => setSavedAnimeIds([]));
    } else {
      setSavedAnimeIds([]);
    }
  }, [user, token]);

  // Navigation logic for dynamic page window (works for both search and default)
  const getMaxPage = () => {
    if (searchQuery && allSearchResults.length > 0) {
      return Math.ceil(allSearchResults.length / PAGE_SIZE) || 1;
    }
    return undefined; // unlimited for default mode
  };

  const handleNext = () => {
    const maxPage = getMaxPage();
    if (maxPage && currentPage >= maxPage) return;
    if (currentPage < pageWindowStart + PAGE_WINDOW - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setPageWindowStart(pageWindowStart + PAGE_WINDOW);
      setCurrentPage(pageWindowStart + PAGE_WINDOW);
    }
  };
  const handlePrev = () => {
    if (currentPage > pageWindowStart) {
      setCurrentPage(currentPage - 1);
    } else if (pageWindowStart > 1) {
      setPageWindowStart(pageWindowStart - PAGE_WINDOW);
      setCurrentPage(pageWindowStart - 1 + PAGE_WINDOW);
    }
  };
  const handlePage = (page) => {
    setCurrentPage(page);
  };

  // Render page buttons for current window
  const renderPageButtons = () => {
    const maxPage = getMaxPage();
    return Array.from({ length: PAGE_WINDOW }, (_, idx) => {
      const pageNum = pageWindowStart + idx;
      if (maxPage && pageNum > maxPage) return null;
      return (
        <button
          key={pageNum}
          className={`px-3 py-1 rounded-full ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => handlePage(pageNum)}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Anime Explorer</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex gap-2">
          {renderPageButtons()}
        </div>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-6 justify-center">
          {animeDataList && animeDataList.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              anime={anime}
              isSaved={savedAnimeIds.includes(anime.id)}
              onSave={async (animeObj) => {
                const animeInfo = { user_id: user.id, anime_id: animeObj.id };
                await addAnimeToList(animeInfo, token);
                setSavedAnimeIds(prev => [...prev, animeObj.id]);
              }}
              onUnsave={async (animeObj) => {
                const animeInfo = { user_id: user.id, anime_id: animeObj.id };
                await removeAnimeFromList(animeInfo, token);
                setSavedAnimeIds(prev => prev.filter(id => id !== animeObj.id));
              }}
              onClick={() => {
                setSelectedAnime(anime);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      </div>
      {/* Modal Popup */}
      {showModal && selectedAnime && (
        <AnimeModal anime={selectedAnime} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}