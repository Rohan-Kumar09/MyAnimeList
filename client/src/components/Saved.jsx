import { useState, useEffect } from "react";
import { getUserInfo } from "../api/FetchMethods";
import { useAuth } from "../context/AuthContext";
import AnimeModal from "./AnimeModal";
import { getSavedAnimeById } from "../api/FetchMethods";
import { useAnimeCache } from "../context/AnimeCacheContext";
import AnimeCard from "./AnimeCard";
import { removeAnimeFromList } from '../api/UserModifyMethod';


export default function SavedPage() {
  const PAGE_SIZE = 10;
  const PAGE_WINDOW = 7;
  const [savedAnimeIds, setSavedAnimeIds] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { cache: animeCache, setCache: setAnimeCache } = useAnimeCache();
  const { user, token } = useAuth();
  const userId = user ? user.id : "";

  // Fetch saved anime IDs for the user
  useEffect(() => {
    if (userId) {
      getUserInfo(userId, token).then(animeIdList => {
        setSavedAnimeIds(animeIdList.map(a => a.anime_id));
      }).catch(() => setSavedAnimeIds([]));
    } else {
      setSavedAnimeIds([]);
    }
  }, [userId, token]);

  // Helper to get anime IDs for a page
  const getAnimeIdsForPage = (page) => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return savedAnimeIds.slice(startIdx, startIdx + PAGE_SIZE);
  };

  // Fetch anime data for current page
  useEffect(() => {
    if (savedAnimeIds.length === 0) {
      setAnimeList([]);
      return;
    }
    const idsToFetch = getAnimeIdsForPage(currentPage);
    const cachedAnime = idsToFetch.map(id => animeCache[id]).filter(Boolean);
    const idsNotCached = idsToFetch.filter(id => !animeCache[id]);
    if (idsNotCached.length > 0) {
      getSavedAnimeById(idsNotCached).then(fetchedAnimeArr => {
        setAnimeCache(prevCache => {
          const newCache = { ...prevCache };
          fetchedAnimeArr.forEach((anime, i) => {
            newCache[idsNotCached[i]] = anime;
          });
          return newCache;
        });
        setAnimeList([...cachedAnime, ...fetchedAnimeArr]);
      }).catch(() => setAnimeList(cachedAnime));
    } else {
      setAnimeList(cachedAnime);
    }
  }, [savedAnimeIds, currentPage, animeCache, setAnimeCache]);

  // Navigation logic for dynamic page window
  const getMaxPage = () => {
    return Math.ceil(savedAnimeIds.length / PAGE_SIZE) || 1;
  };

  const handleNext = () => {
    const maxPage = getMaxPage();
    if (currentPage >= maxPage) return;
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
      if (pageNum > maxPage) return null;
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
    <div className="bg-white shadow-lg rounded-xl p-8 mb-8 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Saved Anime List</h2>
      <p className="text-center text-sm text-gray-600 mb-4">Your saved anime will appear here.</p>
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
          disabled={currentPage === getMaxPage()}
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-6 justify-center min-h-full py-8 px-8">
          {animeList.length === 0 ? (
            <p className="text-center text-gray-500">Nothing to show</p>
          ) : (
            animeList.map((anime, idx) => (
              <AnimeCard
                key={anime.id || idx}
                anime={anime}
                isSaved={true}
                onUnsave={async (animeObj) => {
                  await removeAnimeFromList({ user_id: userId, anime_id: animeObj.id }, token);
                  setSavedAnimeIds(prev => prev.filter(id => id !== animeObj.id));
                }}
                onClick={() => {
                  setSelectedAnime(anime);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>
      </div>
      {/* Modal Popup */}
      {showModal && selectedAnime && (
        <AnimeModal anime={selectedAnime} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}