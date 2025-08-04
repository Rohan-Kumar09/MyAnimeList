import { useState, useEffect } from "react"
import AnimeModal from "./AnimeModal";
import { getAnimeByGenere } from "../api/FetchMethods"
import { useAnimeCache } from "../context/AnimeCacheContext";
import { FaRegBookmark } from 'react-icons/fa';

export default function genereList({ genere }) {
  
  const [animeDataList, setAnimeDataList] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Use global cache from context
  const { cache, setCache } = useAnimeCache();

  useEffect(() => {
    if (cache[genere]) {
      setAnimeDataList(cache[genere]);
    } else {
      getAnimeByGenere(genere).then(dataFetch => {
        setAnimeDataList(dataFetch.data.Page.media);
        setCache(prevCache => ({ ...prevCache, [genere]: dataFetch.data.Page.media }));
        console.log(dataFetch.data.Page.media);
      });
    }
  }, [genere]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{genere}</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {animeDataList && animeDataList.map((anime, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded w-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition relative"
              onClick={() => {
                setSelectedAnime(anime);
                setShowModal(true);
              }}
            >
              <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-40 h-56 object-cover mb-2 rounded" />
              <h3 className="text-sm font-medium mb-1">{anime.title.english || anime.title.romaji}</h3>
              {/* Save React icon at bottom right */}
              <button
                className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700"
                onClick={e => {
                  e.stopPropagation();
                  // TODO: Add save handler here
                  alert(`Saved: ${anime.title.english || anime.title.romaji}`);
                }}
                title="Save Anime"
              >
                <FaRegBookmark size={24} />
              </button>
            </div>
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