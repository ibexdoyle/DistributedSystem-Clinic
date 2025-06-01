import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const PatientForm = ({ open, onClose, patient, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    idCard: '',
    address: '',
    insuranceNumber: '',
    relativeName: '',
    relativePhone: ''
  });

  React.useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        gender: patient.gender || 'Nam',
        dob: patient.dob || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        idCard: patient.idCard || '',
        insuranceNumber: patient.insuranceNumber || '',
        bloodType: patient.bloodType || '',
        allergy: patient.allergy || '',
        medicalHistory: patient.medicalHistory || ''
      });
    } else {
      setFormData({
        name: '',
        gender: 'Nam',
        dob: '',
        phone: '',
        email: '',
        address: '',
        idCard: '',
        insuranceNumber: '',
        bloodType: '',
        allergy: '',
        medicalHistory: ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth 
      PaperProps={{ 
        sx: { 
          minWidth: '1000px',
          maxWidth: '1000px',
          '& .MuiDialogContent-root': {
            padding: '20px 24px'
          }
        } 
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {patient ? 'Chỉnh sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ 
          '& .MuiFormControl-root': { 
            width: '100%',
            marginTop: '16px',
            marginBottom: '8px'
          },
          '& .MuiInputBase-root': {
            height: '56px',
            '&.MuiInputBase-multiline': {
              height: 'auto'
            }
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
              borderWidth: '1px',
            },
          },
        }}>
          <Grid container spacing={3}>
            {/* Row 1: Basic Info */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Ngày sinh"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Giới tính"
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Row 2: Contact Info */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Số CMND/CCCD"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* Row 3: Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            {/* Row 4: Insurance and Relative Info */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Số thẻ BHYT"
                name="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleChange}
                variant="outlined"
                placeholder="Nếu có"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Họ tên người thân"
                name="relativeName"
                value={formData.relativeName}
                onChange={handleChange}
                variant="outlined"
                placeholder="Nếu có"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="SĐT người thân"
                name="relativePhone"
                value={formData.relativePhone}
                onChange={handleChange}
                variant="outlined"
                placeholder="Nếu có"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            {patient ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientForm;
