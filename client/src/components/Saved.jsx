import { useState, useEffect } from "react";
import { getUserInfo } from "../api/FetchMethods";
import { useAuth } from "../context/AuthContext";
import AnimeModal from "./AnimeModal";
import { getSavedAnimeById } from "../api/FetchMethods";
import { useAnimeCache } from "../context/AnimeCacheContext";

export default function SavedPage() {
  const [animeList, setAnimeList] = useState([]);
  // Use global cache from context
  const { cache: animeCache, setCache: setAnimeCache } = useAnimeCache();
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user, token } = useAuth();
  const userId = user ? user.id : "";

  useEffect(() => {
    if (userId) {
      getUserInfo(userId, token).then(animeIdList => {
        // Only fetch first 10 anime for lazy loading
        const firstTen = animeIdList.slice(0, 10);
        const idsToFetch = firstTen.map(({ anime_id }) => anime_id);
        // Check cache for all IDs
        const cachedAnime = idsToFetch.map(id => animeCache[id]).filter(Boolean);
        const idsNotCached = idsToFetch.filter(id => !animeCache[id]);
        if (idsNotCached.length > 0) {
          getSavedAnimeById(idsNotCached).then(fetchedAnimeArr => {
            // fetchedAnimeArr should be an array of anime objects
            // Update global cache
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
      }).catch(() => setAnimeList([]));
    }
  }, [userId]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Saved Anime List
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Your saved anime will appear here.
      </p>
      <div className="flex-1 w-full overflow-x-auto">
        {animeList.length === 0 ? (
          <p className="text-center text-gray-500">Nothing to show</p>
        ) : (
          <div className="flex flex-wrap gap-4 min-h-full py-8 px-8 justify-center overflow-y-auto">
            {animeList.map((anime, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg p-4 w-48 cursor-pointer hover:shadow-lg transition"
                onClick={() => {
                  setSelectedAnime(anime);
                  setShowModal(true);
                }}
              >
                <img src={anime.coverImage.large} alt={anime.title.romanji || anime.title.english} className="w-40 h-56 object-cover mb-2 rounded" />
                <h3 className="text-sm font-medium mb-1">{anime.title.romanji || anime.title.english}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && selectedAnime && (
        <AnimeModal anime={selectedAnime} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}