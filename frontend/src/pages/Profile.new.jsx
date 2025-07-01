import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  PersonOutline as PersonOutlineIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Danh sách giới tính
const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' }
];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    dateOfBirth: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        dateOfBirth: user.dateOfBirth || ""
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
      errors.push('Vui lòng nhập họ và tên');
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
      errors.push('Vui lòng nhập số điện thoại');
    } else if (!/^(\+?84|0)[1-9][0-9]{8}$/.test(formData.phone)) {
      errors.push('Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0 hoặc +84)');
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Email không hợp lệ');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      setOpenSnackbar(true);
      return;
    }
    
    try {
      setError("");
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }
      
      await updateUserProfile(formDataToSend);
      
      setSuccess("Cập nhật thông tin thành công!");
      setOpenSnackbar(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật thông tin");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Thông tin cá nhân
          </Typography>
          
          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
                sx={{ mr: 1 }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                Lưu thay đổi
              </Button>
            </Box>
          )}
        </Box>
        
        <Grid container spacing={4}>
          {/* Cột trái - Ảnh đại diện */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={avatarPreview || "/default-avatar.png"}
                  sx={{
                    width: 150,
                    height: 150,
                    fontSize: '3rem',
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                />
                {isEditing && (
                  <label htmlFor="avatar-upload">
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        minWidth: 'auto',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        p: 0
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </label>
                )}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {formData.name || 'Chưa cập nhật'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Khác'}
              </Typography>
            </Box>
          </Grid>
          
          {/* Cột phải - Thông tin cá nhân */}
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Giới tính"
                      startAdornment={
                        <InputAdornment position="start" sx={{ mr: 1 }}>
                          {formData.gender === 'female' ? (
                            <FemaleIcon color="action" />
                          ) : formData.gender === 'male' ? (
                            <MaleIcon color="action" />
                          ) : (
                            <PersonOutlineIcon color="action" />
                          )}
                        </InputAdornment>
                      }
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <DatePicker
                      label="Ngày sinh"
                      value={formData.dateOfBirth || null}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          dateOfBirth: date
                        }));
                      }}
                      disabled={!isEditing}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <DateRangeIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
