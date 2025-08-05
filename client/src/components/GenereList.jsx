import { useState, useEffect } from "react"
import AnimeModal from "./AnimeModal";
import { getAnimeByGenere, getUserInfo } from "../api/FetchMethods";
import { useAnimeCache } from "../context/AnimeCacheContext";
import AnimeCard from "./AnimeCard";
import { useAuth } from "../context/AuthContext";
import { addAnimeToList } from "../api/UserModifyMethod";
import { removeAnimeFromList } from '../api/UserModifyMethod';

export default function genereList({ genere }) {
  const [animeDataList, setAnimeDataList] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedAnimeIds, setSavedAnimeIds] = useState([]); // track saved anime IDs
  const { cache, setCache } = useAnimeCache(); // Global cache from context
  const { user, token } = useAuth(); // user for user.id and token for authorization

  // Fetch saved anime IDs for the user (like Saved.jsx)
  useEffect(() => {
    if (user && user.id) {
      getUserInfo(user.id, token).then(animeIdList => {
        // animeIdList is array of { anime_id }
        setSavedAnimeIds(animeIdList.map(a => a.anime_id));
      }).catch(() => setSavedAnimeIds([]));
    } else {
      setSavedAnimeIds([]);
    }
  }, [user, token]);

  useEffect(() => {
    if (cache[genere]) {
      setAnimeDataList(cache[genere]);
    } else {
      getAnimeByGenere(genere).then(dataFetch => {
        setAnimeDataList(dataFetch);
        setCache(prevCache => ({ ...prevCache, [genere]: dataFetch }));
        console.log(dataFetch);
      });
    }
  }, [genere, cache, setCache]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{genere}</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {animeDataList && animeDataList.map((anime, index) => (
            <AnimeCard
              key={index}
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