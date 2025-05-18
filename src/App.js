// App.js (Main Entry Point)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import Home from "./pages/Home";
import Post from "./pages/Post";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/LogIn";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/:postId" element={<PostDetails />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
