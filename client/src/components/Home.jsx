import AnimePage from './AnimeBrowsePage';

function Home() {

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to MyAnimeList</h1>
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Discover, track, and manage your favorite anime series
        </p>

        <AnimePage />
      </div>
    </div>
  );
}

export default Home;
