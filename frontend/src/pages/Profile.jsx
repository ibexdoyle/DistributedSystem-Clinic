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
  Snackbar
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
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
        address: user.address || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || ""
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    try {
      // Simulate avatar upload for testing
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setSuccess("Cập nhật ảnh đại diện thành công!");
      setOpenSnackbar(true);

      // Update the user profile with the new avatar (for testing purposes)
      await updateUserProfile({ ...formData, avatar: avatarPreview });
    } catch (err) {
      setError("Có lỗi xảy ra khi tải lên ảnh đại diện. Vui lòng thử lại.");
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Chỉ validate các trường có giá trị
    if (formData.name && formData.name.trim() === '') {
      errors.push('Tên không được để trống');
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Email không hợp lệ');
    }
    
    if (formData.phone && !/^(\+?84|0)[1-9][0-9]{8}$/.test(formData.phone)) {
      errors.push('Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0 hoặc +84)');
    }
    
    // Kiểm tra ngày sinh nếu có nhập
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errors.push('Ngày sinh phải nhỏ hơn ngày hiện tại');
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Lọc ra chỉ các trường có giá trị để gửi lên server
    const fieldsToUpdate = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // Nếu không có trường nào được cập nhật
    if (Object.keys(fieldsToUpdate).length === 0) {
      setError('Vui lòng nhập thông tin cần cập nhật');
      setOpenSnackbar(true);
      return;
    }

    // Validate các trường có giá trị
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      setOpenSnackbar(true);
      return;
    }

    try {
      // Chỉ gửi các trường có giá trị
      const response = await updateUserProfile(fieldsToUpdate);
      
      // Nếu response là undefined hoặc không có lỗi, coi như thành công
      if (!response || !response.error) {
        setSuccess("Cập nhật thông tin thành công!");
        setOpenSnackbar(true);
        setIsEditing(false);

        // Nếu có cập nhật ảnh đại diện
        if (selectedFile) {
          await handleAvatarUpload();
        }
        
        // Cập nhật lại thông tin người dùng hiển thị
        if (user) {
          setFormData(prev => ({
            ...prev,
            ...fieldsToUpdate
          }));
        }
      } else {
        // Xử lý lỗi từ API nếu có
        setError(response.error || "Có lỗi xảy ra khi cập nhật thông tin");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      
      // More specific error handling
      let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = "Bạn cần đăng nhập để thực hiện thao tác này";
        } else if (err.response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập.";
        } else if (err.response.status >= 500) {
          errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }
      
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || ""
    });
    setIsEditing(false);
    setError("");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4
          }}
        >
          <Typography variant="h4" component="h1" color="primary">
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
                onClick={handleCancelEdit}
                sx={{ mr: 2 }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                Lưu thay đổi
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  alt={user.name}
                  src={avatarPreview}
                  sx={{
                    width: 150,
                    height: 150,
                    fontSize: "3rem",
                    mb: 2,
                    border: "3px solid",
                    borderColor: "primary.main",
                    cursor: isEditing ? "pointer" : "default",
                    "&:hover": isEditing
                      ? {
                          opacity: 0.8
                        }
                      : {}
                  }}
                  onClick={() =>
                    isEditing &&
                    document.getElementById("avatar-upload").click()
                  }
                >
                  {!avatarPreview && (user.name?.charAt(0) || "U")}
                </Avatar>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === "patient"
                  ? "Bệnh nhân"
                  : user.role === "doctor"
                  ? "Bác sĩ"
                  : "Quản trị viên"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Giới tính"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    SelectProps={{
                      native: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.gender === "male" ? (
                            <MaleIcon color="action" />
                          ) : formData.gender === "female" ? (
                            <FemaleIcon color="action" />
                          ) : (
                            <PersonOutlineIcon color="action" />
                          )}
                        </InputAdornment>
                      )
                    }}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
