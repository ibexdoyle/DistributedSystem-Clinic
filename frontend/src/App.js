import React, { Suspense, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import Footer from './layouts/Footer';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/admin/Prescriptions';
import Notifications from './pages/Notifications';
import MyAppointments from './pages/MyAppointments';
import MyMedicalRecords from './pages/MyMedicalRecords';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import News from './pages/News';
import Contact from './pages/Contact';
import EmergencyDepartment from './pages/EmergencyDepartment';
import PediatricsDepartment from './pages/PediatricsDepartment'; 
import DentistryDepartment from './pages/DentistryDepartment';
import OphthalmologyDepartment from './pages/OphthalmologyDepartment';
import ENTDepartment from './pages/ENTDepartment';
import NeurologyDepartment from './pages/NeurologyDepartment';
import Profile from './pages/Profile';
import Admin from './pages/admin';
import Medicines from './pages/admin/Medicines';

// Lazy load doctor components
const DoctorLayout = React.lazy(() => import('./layouts/DoctorLayout'));
const DoctorDashboard = React.lazy(() => import('./pages/doctor/Dashboard'));
const DoctorAppointments = React.lazy(() => import('./pages/doctor/Appointments'));
const DoctorPatients = React.lazy(() => import('./pages/doctor/Patients'));
const DoctorPrescriptions = React.lazy(() => import('./pages/doctor/Prescriptions'));
const DoctorMedicalRecords = React.lazy(() => import('./pages/doctor/MedicalRecords'));

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

// Doctor Route Wrapper
const DoctorRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'doctor') {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

function MainContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  
  // Redirect to appropriate dashboard based on role after login
  useEffect(() => {
    if (user && location.pathname === '/') {
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, location, navigate]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && !isDoctorRoute && <Navbar />}
      <Box component="main" sx={{ 
        flex: 1, 
        width: '100%', 
        maxWidth: '100%', 
        overflowX: 'hidden',
        backgroundColor: isAdminRoute || isDoctorRoute ? '#f5f7fa' : 'inherit',
        padding: (isAdminRoute || isDoctorRoute) ? '20px' : 0
      }}>
        <Suspense fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/specialties/cap-cuu" element={<EmergencyDepartment />} />
            <Route path="/specialties/nhi" element={<PediatricsDepartment />} />
            <Route path="/specialties/rang-ham-mat" element={<DentistryDepartment />} />
            <Route path="/specialties/mat" element={<OphthalmologyDepartment />} />
            <Route path="/specialties/tai-mui-hong" element={<ENTDepartment />} />
            <Route path="/specialties/than-kinh" element={<NeurologyDepartment />} />
           
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Patient routes */}
            <Route path="/patients" element={
              <ProtectedRoute>
                {user?.role === 'doctor' ? (
                  <Navigate to="/doctor/patients" replace />
                ) : (
                  <Patients />
                )}
              </ProtectedRoute>
            } />
            
            <Route path="/appointments" element={
              <ProtectedRoute>
                {user?.role === 'doctor' ? (
                  <Navigate to="/doctor/appointments" replace />
                ) : (
                  <Appointments />
                )}
              </ProtectedRoute>
            } />
            
            <Route path="/prescriptions" element={
              <ProtectedRoute>
                {user?.role === 'doctor' ? (
                  <Navigate to="/doctor/prescriptions" replace />
                ) : (
                  <Prescriptions />
                )}
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
            
            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <DoctorRoute>
                <DoctorLayout />
              </DoctorRoute>
            }>
              <Route index element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="medical-records" element={<DoctorMedicalRecords />} />
              <Route path="prescriptions" element={<DoctorPrescriptions />}>
                <Route path="new" element={<DoctorPrescriptions />} />
              </Route>
              <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<div>Admin Dashboard</div>} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="medicines" element={<Medicines />} />
              <Route path="users" element={<div>Quản lý tài khoản</div>} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
            
            {/* Redirect all other paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
      {!isAdminRoute && !isDoctorRoute && <Footer />}
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
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
