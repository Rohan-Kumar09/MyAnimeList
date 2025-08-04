import DOMPurify from 'dompurify';
import { AiOutlineClose } from "react-icons/ai";

export default function AnimeModal({ anime, onClose }) {
  if (!anime) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AiOutlineClose />
        </button>
        <div className="flex gap-4">
          <img src={anime.coverImage?.large} alt={anime.title?.romaji} className="w-40 h-56 object-cover rounded" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{anime.title?.english || anime.title?.romaji}</h2>
            <p className="text-sm text-gray-700 mb-2"><strong>Genres:</strong> {anime.genres && anime.genres.join(', ')}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Mean Score:</strong> {anime.meanScore !== undefined ? anime.meanScore : 'N/A'}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Adult Content:</strong> {anime.isAdult ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Start Date:</strong> {
              (anime.startDate && (anime.startDate.day || anime.startDate.month || anime.startDate.year))
                ? `${anime.startDate.day || ''}/${anime.startDate.month || ''}/${anime.startDate.year || ''}`
                : 'N/A'
            }
            </p>
            <p className="text-sm text-gray-700 mb-2"><strong>End Date:</strong> {
              (anime.endDate && (anime.endDate.day || anime.endDate.month || anime.endDate.year))
                ? `${anime.endDate.day || ''}/${anime.endDate.month || ''}/${anime.endDate.year || ''}`
                : 'N/A'
            }</p>
            <p className="text-xs text-gray-600 mt-2"><strong>Description:</strong>{" "}<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(anime.description || "") }} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}
