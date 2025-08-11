const infoapi = import.meta.env.VITE_INFOAPI;
const backend = import.meta.env.VITE_BACKEND;

// For adding anime to the user's list
export const addAnimeToList = async (animeInfo, token) => {
  const response = await fetch(`${backend}addAnimeToList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(animeInfo),
  });
  if (!response.ok) {
    throw new Error("Failed to add anime to list");
  }
  return response.json();
}

// For removing anime from the user's list
export const removeAnimeFromList = async (animeInfo, token) => {
  const response = await fetch(`${backend}removeAnimeFromList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(animeInfo),
  });
  if (!response.ok) {
    throw new Error("Failed to remove anime from list");
  }
  return response.json();
}