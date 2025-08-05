import { useState } from "react";
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

export default function AnimeCard({ anime, isSaved, onSave, onUnsave, onClick }) {
  // Local state for loading indicator (optional)
  const [loading, setLoading] = useState(false);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (isSaved) {
        if (onUnsave) await onUnsave(anime);
      } else {
        if (onSave) await onSave(anime);
      }
    } catch (err) {
      // Optionally show error
      console.error("Bookmark action failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 w-48 cursor-pointer hover:shadow-lg transition relative"
      onClick={() => onClick && onClick(anime)}
    >
      <img src={anime.coverImage?.large} alt={anime.title?.romaji || anime.title?.english} className="w-40 h-56 object-cover mb-2 rounded" />
      <h3 className="text-sm font-medium mb-1">{anime.title?.english || anime.title?.romaji}</h3>
      {/* Bookmark icon at bottom right */}
      <button
        className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700"
        onClick={handleBookmarkClick}
        title={isSaved ? "Remove from Saved" : "Save Anime"}
        disabled={loading}
      >
        {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
      </button>
    </div>
  );
}
