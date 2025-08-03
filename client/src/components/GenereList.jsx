import { useState, useEffect } from "react"
import { getAnimeByGenere } from "../api/UserMethods"


export default function genereList({ genere }) {
  
  const [animeDataList, setAnimeDataList] = useState(null);

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
            <div key={index} className="bg-gray-100 p-2 rounded w-48 flex-shrink-0">
              <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-40 h-56 object-cover mb-2 rounded" />
              <h3 className="text-sm font-medium mb-1">{anime.title.english || anime.title.romaji}</h3>
              <p className="text-xs text-gray-600 line-clamp-3">{anime.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}