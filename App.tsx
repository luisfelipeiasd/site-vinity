import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/admin/Login';

// Lazy Load Components for Performance
const Home = React.lazy(() => import('./pages/Home'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Admin = React.lazy(() => import('./pages/admin/Admin'));

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center pt-[80px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Login />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <Layout>
            <Suspense fallback={
              <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center pt-[80px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Suspense>
          </Layout>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
