import React, { useState, useEffect } from 'react';
import { getAnimeByTitle, getAnimeByGenere } from '../api/UserMethods';

function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Thriller'];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const data = await getAnimeByTitle(searchTerm);
      setAnimeList(data);
    } catch (error) {
      console.error('Error searching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSearch = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    try {
      const data = await getAnimeByGenere(genre);
      setAnimeList(data);
    } catch (error) {
      console.error('Error searching by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Anime</h1>
      
      {/* Search Section */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search anime by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreSearch(genre)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedGenre === genre
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animeList.map((anime, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {anime.coverImage && (
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{anime.title}</h3>
                {anime.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {anime.description}
                  </p>
                )}
                {anime.genres && (
                  <div className="flex flex-wrap gap-1">
                    {anime.genres.split(',').map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && animeList.length === 0 && (searchTerm || selectedGenre) && (
        <div className="text-center py-8 text-gray-500">
          No anime found. Try a different search term or genre.
        </div>
      )}
    </div>
  );
}

export default Browse;
