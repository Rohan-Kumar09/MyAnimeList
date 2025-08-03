const database = "http://127.0.0.1:8080/"
const infoapi = "https://graphql.anilist.co"

// For adding a user
export const addUser = async (userData) => {
  try {
    const response = await fetch(`${database}addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

// For getting user information
export const getUserInfo = async (userEmail) => {
  try {
    const response = await fetch(`${database}user/${userEmail}`);
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
              description
              genres
            }
          }
        }
      `,
      variables: { search: title },
    }),
  })
  const data = await response.json();
  return data;
}

// For home page
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
  return data;
}