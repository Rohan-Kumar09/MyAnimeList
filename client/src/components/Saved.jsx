import { useState, useEffect } from "react";
import { getUserInfo } from "../api/FetchMethods";
import { useAuth } from "../context/AuthContext";
import AnimeModal from "./AnimeModal";
import { getSavedAnimeById } from "../api/FetchMethods";
import { useAnimeCache } from "../context/AnimeCacheContext";
import AnimeCard from "./AnimeCard";
import { removeAnimeFromList } from '../api/UserModifyMethod';

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
              <AnimeCard
                key={idx}
                anime={anime}
                isSaved={true}
                onUnsave={async (animeObj) => {
                  await removeAnimeFromList({ user_id: userId, anime_id: animeObj.id }, token);
                  setAnimeList(prev => prev.filter(a => a.id !== animeObj.id));
                }}
                onClick={() => {
                  setSelectedAnime(anime);
                  setShowModal(true);
                }}
              />
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