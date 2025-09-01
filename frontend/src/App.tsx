import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

// Import Pages
// ... other imports
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* ... other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
