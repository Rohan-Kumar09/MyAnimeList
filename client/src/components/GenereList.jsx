import { useState, useEffect } from "react"
import { AiOutlineClose } from "react-icons/ai";
import { getAnimeByGenere } from "../api/UserMethods"
import DOMPurify from 'dompurify';

export default function genereList({ genere }) {
  
  const [animeDataList, setAnimeDataList] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAnimeByGenere(genere).then(dataFetch => {
      setAnimeDataList(dataFetch.data.Page.media);
      console.log(dataFetch.data.Page.media);
    });
  }, [genere]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{genere}</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {animeDataList && animeDataList.map((anime, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded w-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                setSelectedAnime(anime);
                setShowModal(true);
              }}
            >
              <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-40 h-56 object-cover mb-2 rounded" />
              <h3 className="text-sm font-medium mb-1">{anime.title.english || anime.title.romaji}</h3>
              <p className="text-xs text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(anime.description) }} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && selectedAnime && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Only close if the user clicks the overlay, not the modal content
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose />
            </button>
            <div className="flex gap-4">
              <img src={selectedAnime.coverImage.large} alt={selectedAnime.title.romaji} className="w-40 h-56 object-cover rounded" />
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedAnime.title.english || selectedAnime.title.romaji}</h2>
                <p className="text-sm text-gray-700 mb-2"><strong>Genres:</strong> {selectedAnime.genres && selectedAnime.genres.join(', ')}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Mean Score:</strong> {selectedAnime.meanScore !== undefined ? selectedAnime.meanScore : 'N/A'}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Adult Content:</strong> {selectedAnime.isAdult ? 'Yes' : 'No'}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Start Date:</strong> {
                  (selectedAnime.startDate && (selectedAnime.startDate.day || selectedAnime.startDate.month || selectedAnime.startDate.year))
                    ? `${selectedAnime.startDate.day || ''}/${selectedAnime.startDate.month || ''}/${selectedAnime.startDate.year || ''}`
                    : 'N/A'
                }
                </p>
                <p className="text-sm text-gray-700 mb-2"><strong>End Date:</strong> {
                  (selectedAnime.endDate && (selectedAnime.endDate.day || selectedAnime.endDate.month || selectedAnime.endDate.year))
                    ? `${selectedAnime.endDate.day || ''}/${selectedAnime.endDate.month || ''}/${selectedAnime.endDate.year || ''}`
                    : 'N/A'
                }</p>
                <p className="text-xs text-gray-600 mt-2"><strong>Description:</strong>{" "} <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedAnime.description) }} /></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}