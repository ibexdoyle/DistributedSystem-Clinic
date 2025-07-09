import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import api from '../../config/api';

export default function AppointmentForm({ onSubmit, loading, userEmail }) {
  const [formData, setFormData] = useState({
    patientEmail: userEmail,
    department: '',
    doctorId: '',
    notes: '',
    appointmentDate: new Date(),
    patientName: '',
    patientPhone: '',
    patientAddress: '',
    patientGender: 'MALE',
    patientDob: null
  });
  
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState({
    departments: true,
    doctors: false,
  });
  const [error, setError] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('http://localhost:8084/api/departments');
        setDepartments(response.data);
      } catch (err) {
        setError('Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.');
        console.error('Error fetching departments:', err);
      } finally {
        setIsLoading(prev => ({ ...prev, departments: false }));
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formData.department) return;

      setIsLoading(prev => ({ ...prev, doctors: true }));
      try {
        const response = await api.get(`http://localhost:8084/api/doctors/department/${formData.department}`);
        setDoctors(response.data);
      } catch (err) {
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    fetchDoctors();
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const handleDobChange = (date) => {
    setFormData(prev => ({
      ...prev,
      patientDob: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['patientName', 'patientPhone', 'department', 'doctorId', 'appointmentDate'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.patientPhone && !/^\d{10,11}$/.test(formData.patientPhone)) {
      setError('Số điện thoại không hợp lệ');
      return;
    }

    try {
      setError('');
      await onSubmit({
        ...formData,
        appointmentDate: formData.appointmentDate.toISOString(),
      });
    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch hẹn';
      setError(errorMsg);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Thông tin đặt lịch khám
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Patient Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Thông tin bệnh nhân
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ và tên *"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại *"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
              inputProps={{ maxLength: 11 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="patientEmail"
              value={formData.patientEmail}
              disabled
              variant="outlined"
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Giới tính"
              name="patientGender"
              value={formData.patientGender}
              onChange={handleChange}
              select
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
              <MenuItem value="OTHER">Khác</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Ngày sinh"
                value={formData.patientDob}
                onChange={handleDobChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                )}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="patientAddress"
              value={formData.patientAddress}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>

          {/* Appointment Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Thông tin đặt lịch
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Chuyên khoa *"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={isLoading.departments}
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="">
                <em>Chọn chuyên khoa</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Bác sĩ *"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={!formData.department || isLoading.doctors}
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="">
                <em>Chọn bác sĩ</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.fullName} - {doctor.specialization}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DateTimePicker
                label="Ngày giờ khám *"
                value={formData.appointmentDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                  />
                )}
                minDateTime={new Date()}
                minutesStep={15}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ghi chú (nếu có)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || isLoading.departments || isLoading.doctors}
            sx={{ minWidth: 200 }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Đang xử lý...' : 'Đặt lịch khám'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
