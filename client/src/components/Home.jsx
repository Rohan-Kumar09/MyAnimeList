import React from 'react';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to MyAnimeList</h1>
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Discover, track, and manage your favorite anime series
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Browse Anime</h3>
            <p className="text-gray-600">Explore our vast collection of anime series</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Keep track of episodes you've watched</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Create Lists</h3>
            <p className="text-gray-600">Organize your anime into custom lists</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
