import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LostItemsDashboard from './pages/LostItemsDashboard';
import FoundItemsDashboard from './pages/FoundItemsDashboard';
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import ItemDetail from './pages/ItemDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminItems from './pages/AdminItems';
import ClaimsManagement from './pages/admin/ClaimsManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminToken || !adminUser) {
    return <Navigate to="/admin/login" />;
  }
  
  try {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      return <Navigate to="/admin/login" />;
    }
  } catch (error) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 dark:bg-transparent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/lost-items" element={<ProtectedRoute><LostItemsDashboard /></ProtectedRoute>} />
            <Route path="/found-items" element={<ProtectedRoute><FoundItemsDashboard /></ProtectedRoute>} />
            <Route path="/report-lost" element={<ProtectedRoute><ReportLostItem /></ProtectedRoute>} />
            <Route path="/report-found" element={<ProtectedRoute><ReportFoundItem /></ProtectedRoute>} />
            <Route path="/item/:type/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/search" element={<Search />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
            <Route path="/admin/items" element={<AdminProtectedRoute><AdminItems /></AdminProtectedRoute>} />
            <Route path="/admin/claims" element={<AdminProtectedRoute><ClaimsManagement /></AdminProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;