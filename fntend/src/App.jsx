import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Start from "./pages/Start";
import User_profile from "./pages/User_profile";
import Content_view from "./pages/Content_view";
import Notification from "./pages/Notification";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import ProtectedRoute from "./context/ProtectedRoute";
import NotFound from "./components/NotFound";
import Upload from "./pages/Upload";
// import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<User_profile />} />
          <Route path="/content/:postId" element={<Content_view />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
