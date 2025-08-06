import { useState } from "react";
import AnimeBrowsePage from "./AnimeBrowsePage";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search anime by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>
      <AnimeBrowsePage searchQuery={query} />
    </div>
  );
}

export default Search;
