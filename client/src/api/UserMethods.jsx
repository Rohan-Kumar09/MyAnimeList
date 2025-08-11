const database = import.meta.env.VITE_DATABASE;

// For user login
export const userLogin = async (credentials) => {
  try {
    const response = await fetch(`${database}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

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

// for deleting a user account
export const deleteUserAccount = async (userId, token) => {
  try {
    const response = await fetch(`${database}user/delete`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
}