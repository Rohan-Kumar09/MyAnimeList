import { useState, useEffect } from "react";
import { getUserInfo } from "../api/FetchMethods";
import { useAuth } from "../context/AuthContext";
import AnimeModal from "./AnimeModal";

export default function SavedPage() {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user, token } = useAuth();
  const userId = user ? user.id : "";

  useEffect(() => {
    if (userId) {
      getUserInfo(userId, token).then(data => {
        // data is Array of anime objects
        setAnimeList(data || []);
        console.log("Fetched user's saved anime from db:", data);
      }).catch(() => setAnimeList([]));
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Saved Anime List
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your saved anime will appear here.
        </p>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          {animeList.length === 0 ? (
            <p className="text-center text-gray-500">No saved anime yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {animeList.map((anime, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 p-2 rounded w-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition"
                    onClick={() => {
                      setSelectedAnime(anime);
                      setShowModal(true);
                    }}
                  >
                    <img src={anime.coverImage} alt={anime.title} className="w-40 h-56 object-cover mb-2 rounded" />
                    <h3 className="text-sm font-medium mb-1">{anime.title || anime.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Popup */}
        {showModal && selectedAnime && (
          <AnimeModal anime={selectedAnime} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
}