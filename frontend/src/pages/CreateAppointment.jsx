import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  CircularProgress, 
  Button,
  Paper,
  Grid
} from '@mui/material';
import AppointmentForm from '../components/appointment/AppointmentForm';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const STEPS = {
  LOADING: 'loading',
  APPOINTMENT: 'appointment',
  SUCCESS: 'success'
};

export default function CreateAppointment() {
  const [step, setStep] = useState(STEPS.LOADING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle appointment submission
  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare appointment data
      const appointment = {
        ...appointmentData,
        patientEmail: user.email, // Using email as the patient identifier
        status: 'PENDING'
      };
      
      // Call the appointment service
      await api.post('http://localhost:8084/api/appointments', appointment);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorMsg = err.response?.data?.message || 'Không thể tạo lịch hẹn';
      setError(`${errorMsg}. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/appointments/new' } });
      return;
    }
    setLoading(false);
    setStep(STEPS.APPOINTMENT);
  }, [user, navigate]);

  if (!user) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Vui lòng đăng nhập để đặt lịch khám.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login', { state: { from: '/appointments/new' } })}
        >
          Đăng nhập
        </Button>
      </Box>
    );
  }

  const renderStep = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Đang xử lý...</Typography>
        </Box>
      );
    }

    switch (step) {
      case STEPS.APPOINTMENT:
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Đặt lịch khám
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <AppointmentForm 
              onSubmit={handleAppointmentSubmit} 
              loading={loading}
              userEmail={user.email}
            />
          </Box>
        );

      case STEPS.SUCCESS:
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Đặt lịch khám thành công!
            </Alert>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/appointments')}
            >
              Xem lịch hẹn của tôi
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đặt lịch khám
        </Typography>
        
        {renderStep()}
      </Box>
    </Box>
  );
}
