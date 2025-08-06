import AnimePage from './AnimeBrowsePage';
import Search from './Search';

import { useState } from 'react';

function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  //const genres = [
  //  "Action", 
  //  "Adventure", 
  //  "Comedy", 
  //  "Drama", 
  //  "Fantasy", 
  //  "Horror", 
  //  "Mystery", 
  //  "Romance", 
  //  "Sci-Fi", 
  //  "Slice of Life"
  //];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchActive(!!query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        {!searchActive ? (
          <Search onSearch={handleSearch} />
        ) : (
          <AnimePage searchQuery={searchQuery} onBack={() => { setSearchActive(false); setSearchQuery(""); }} />
        )}
      </div>
    </div>
  );
}

export default Home;
