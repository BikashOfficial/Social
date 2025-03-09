import { useContext } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Posts from "../components/Posts"
import Sidebar from "../components/Sidebar"
import Stories from "../components/Stories"
import { UserDataContext } from "../context/UserContext";

const Home = () => {

  const { user } = useContext(UserDataContext);
  console.log(user);
  const stories = [
    { id: 1, username: 'user1', avatar: 'https://placekitten.com/100/100' },
    { id: 2, username: 'user2', avatar: 'https://placekitten.com/101/101' },
    { id: 3, username: 'user3', avatar: 'https://placekitten.com/102/102' },
    { id: 4, username: 'user4', avatar: 'https://placekitten.com/103/103' },
    { id: 5, username: 'user5', avatar: 'https://placekitten.com/104/104' },
    { id: 6, username: 'user6', avatar: 'https://placekitten.com/105/105' },
    { id: 7, username: 'user7', avatar: 'https://placekitten.com/106/106' },
    { id: 8, username: 'user8', avatar: 'https://placekitten.com/107/107' },
    { id: 9, username: 'user9', avatar: 'https://placekitten.com/108/108' },
    { id: 10, username: 'user10', avatar: 'https://placekitten.com/109/109' },
    { id: 1, username: 'user1', avatar: 'https://placekitten.com/100/100' },
    { id: 2, username: 'user2', avatar: 'https://placekitten.com/101/101' },
    { id: 3, username: 'user3', avatar: 'https://placekitten.com/102/102' },
    { id: 4, username: 'user4', avatar: 'https://placekitten.com/103/103' },
    { id: 5, username: 'user5', avatar: 'https://placekitten.com/104/104' },
    { id: 6, username: 'user6', avatar: 'https://placekitten.com/105/105' },
    { id: 7, username: 'user7', avatar: 'https://placekitten.com/106/106' },
    { id: 8, username: 'user8', avatar: 'https://placekitten.com/107/107' },
    { id: 9, username: 'user9', avatar: 'https://placekitten.com/108/108' },
    { id: 10, username: 'user10', avatar: 'https://placekitten.com/109/109' },
    // add more story objects as needed to test scrolling
  ];
  return (
    <>
      <div className="mb-18">
        <Header />
      </div>
      <div>

        <div className="flex">

          {/* Sidebar manages its own layout based on screen size */}
          <div className="z-100">
            <Sidebar />
          </div>



          {/* <main className="flex-1 md:ml-64 over bg-gray-100"> */}
            {/* Posts feed */}
            <main className="flex-1 md:ml-64 overflow-y-auto bg-gray-100">
            <Posts />

          </main>




        </div>

      </div>
      <Footer />
    </>
  )
}

export default Home