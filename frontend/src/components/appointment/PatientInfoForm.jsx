import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Grid, 
  MenuItem, 
  Paper, 
  TextField, 
  Typography 
} from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';

import { useAuth } from '../../contexts/AuthContext';

export default function PatientInfoForm({ 
  onSubmit, 
  initialData = {}, 
  loading = false, 
  onBack 
}) {
  const { user } = useAuth();
  
  // Get email from the authenticated user (JWT token)
  const userEmail = user?.email || '';
  
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    dob: initialData.dob ? new Date(initialData.dob) : null,
    gender: initialData.gender || 'MALE',
    email: userEmail, // Always use the logged-in user's email from JWT
    phoneNumber: initialData.phoneNumber || '',
    address: initialData.address || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Vui lòng chọn ngày sinh';
    } else if (formData.dob > new Date()) {
      newErrors.dob = 'Ngày sinh không hợp lệ';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      dob: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure email is always the logged-in user's email
    const formDataWithEmail = {
      ...formData,
      email: userEmail || formData.email
    };
    
    if (validateForm()) {
      // Format the date to ISO string before submitting
      const formattedData = {
        ...formDataWithEmail,
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : null
      };
      onSubmit(formattedData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Thông tin bệnh nhân
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Ngày sinh"
                value={formData.dob}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.dob}
                    helperText={errors.dob}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="MALE">Nam</MenuItem>
                <MenuItem value="FEMALE">Nữ</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Email đăng nhập
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    alignItems: 'center',
                    minHeight: '56px',
                    backgroundColor: (theme) => theme.palette.grey[100]
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <EmailOutlined color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {formData.email}
                    </Typography>
                  </Box>
                </Paper>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                  Email được sử dụng để đăng nhập và nhận thông báo
                </Typography>
                {/* Hidden input for form submission */}
                <input type="hidden" name="email" value={formData.email} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {onBack && (
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    onClick={onBack}
                    fullWidth
                    disabled={loading}
                    size="large"
                    startIcon={<ArrowBack />}
                    sx={{ py: 1.5 }}
                  >
                    Quay lại
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} sm={onBack ? 6 : 12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Tiếp tục đặt lịch khám'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
