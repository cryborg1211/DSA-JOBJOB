import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { useAuthStore } from './store/authStore';
import LoginPage from './features/auth/LoginPage';
import RoleSelectionPage from './features/auth/RoleSelectionPage';
import ProfilePage from './features/auth/ProfilePage';
import MatchDashboard from './features/matching/MatchDashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

/** Pages where the Navbar should be hidden (auth flow) */
const AUTH_PATHS = ['/login', '/register', '/select-role', '/profile-setup'];

function AppContent() {
  const location = useLocation();
  const showNavbar = !AUTH_PATHS.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Auth flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/select-role" element={<PrivateRoute><RoleSelectionPage /></PrivateRoute>} />
          <Route path="/profile-setup" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* App pages */}
          <Route path="/dashboard" element={<PrivateRoute><MatchDashboard /></PrivateRoute>} />
          <Route path="/match" element={<PrivateRoute><MatchDashboard /></PrivateRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
