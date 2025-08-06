const infoapi = import.meta.env.VITE_INFOAPI;
const database = import.meta.env.VITE_DATABASE;

// For getting user information
export const getUserInfo = async (userId, token) => {
  try {
    const response = await fetch(`${database}user?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// For fetching saved anime by ID
export const getSavedAnimeById = async (animeIdList) => {
  try {
    const response = await fetch(infoapi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                genres
                description
                isAdult
                meanScore
                startDate {
                  day
                  month
                  year
                }
                endDate {
                  day
                  month
                  year
                }
              }
            }
          }
        `,
        variables: { ids: animeIdList },
      }),
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error("Error fetching anime by ID:", error);
    throw error;
  }
}

// For search functionality
export const getAnimeByTitle = async (title) => {
  const response = await fetch(infoapi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($search: String!, $page: Int = 1, $perPage: Int = 10) {
          Page(page: $page, perPage: $perPage) {
            media(search: $search, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              genres
              description
              isAdult
              meanScore
              startDate {
                day
                month
                year
              }
              endDate {
                day
                month
                year
              }
            }
          }
        }
      `,
      variables: { search: title },
    }),
  })
  const data = await response.json();
  return data.data.Page.media;
}

// For home page
// replaced with getAnimeByIds()
export const getAnimeByGenere = async (genere) => {
  const response = await fetch(infoapi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($genreIn: [String], $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(genre_in: $genreIn, type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              genres
              description
              isAdult
              meanScore
              startDate {
                day
                month
                year
              }
              endDate {
                day
                month
                year
              }
            }
          }
        }
      `, variables: {
        'genreIn': genere,
        'page': 1,
        'perPage': 10
      }
    })
  })

  const data = await response.json();
  return data.data.Page.media;
}

// Fetch multiple anime by an array of IDs (for paginated GenereList)
// For Home page
export const getAnimeByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  try {
    const response = await fetch(infoapi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                genres
                description
                isAdult
                meanScore
                startDate {
                  day
                  month
                  year
                }
                endDate {
                  day
                  month
                  year
                }
              }
            }
          }
        `,
        variables: { ids },
      }),
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error("Error fetching anime by IDs:", error);
    throw error;
  }
};