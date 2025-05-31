import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import Footer from './layouts/Footer';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import Notifications from './pages/Notifications';
import MyAppointments from './pages/MyAppointments';
import MyMedicalRecords from './pages/MyMedicalRecords';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import News from './pages/News';
import Contact from './pages/Contact';
import EmergencyDepartment from './pages/EmergencyDepartment';
import Profile from './pages/Profile';
import Admin from './pages/admin';
// import AdminLayout from './pages/admin/Layout';
// import AdminDashboard from './pages/admin/Dashboard';
// import AdminUsers from './pages/admin/Users';
// import AdminPatients from './pages/admin/Patients';

// Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Lưu đường dẫn hiện tại vào state trước khi chuyển hướng đến login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Kiểm tra quyền admin nếu cần
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/not-found" replace />;
  }
  
  return children || <Outlet />;
};

function MainContent() {
  const location = useLocation();
  // Kiểm tra xem có phải là trang admin không
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <Box component="main" sx={{ 
        flex: 1, 
        width: '100%', 
        maxWidth: '100%', 
        overflowX: 'hidden',
        backgroundColor: isAdminRoute ? '#f5f7fa' : 'inherit',
        padding: isAdminRoute ? '20px' : 0
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/specialties/cap-cuu" element={<EmergencyDepartment />} />
          
          {/* Protected routes */}
          <Route path="/patients" element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          } />
          
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          
          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/my-appointments" element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          } />
          
          <Route path="/my-medical-records" element={
            <ProtectedRoute>
              <MyMedicalRecords />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Redirect all other paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      {!isAdminRoute && <Footer />}
    </Box>
  );
}

function AppContent() {
  const { login } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
