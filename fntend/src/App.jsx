import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserDataProvider } from './context/UserContext';
import ProtectedRoute from './context/ProtectedRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Content_view from './pages/Content_view';
import User_profile from './pages/User_profile';
import Notification from './pages/Notification';
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <UserDataProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/post/:postId" element={<Content_view />} />
            <Route path="/user/:userId" element={<User_profile />} />
            <Route path="/notifications" element={<Notification />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserDataProvider>
    </Router>
  );
}

export default App;
