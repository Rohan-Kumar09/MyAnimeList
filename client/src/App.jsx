import { getAnimeByTitle, getAnimeByGenere, addUser } from "./api/UserMethods";

function App() {
  //getAnimeByTitle("Naruto").then(data => {
  //  console.log(data);
  //})

  //getAnimeByGenere("Action").then(data => {
  //  console.log(data);
  //})

  //addUser({
  //  email: "test@test.com",
  //  username: "testuser",
  //  password: "password123"
  //}).then(response => {
  //  console.log("User added:", response);
  //})

  return (
    <h1 className='flex items-center justify-center h-screen text-3xl font-bold text-blue-500'>
      Hello World!
    </h1>
  );
}

export default App
