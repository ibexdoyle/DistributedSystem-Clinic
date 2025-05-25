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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation before submitting
    if (!formData.name) {
      setError("Vui lòng nhập họ và tên!");
      setOpenSnackbar(true);
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Vui lòng nhập email hợp lệ!");
      setOpenSnackbar(true);
      return;
    }
    if (!formData.phone || !/^(\+?84|0)[1-9][0-9]{8}$/.test(formData.phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ!");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Simulate API call for testing (remove this when backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // Update user profile (this will call the actual API when implemented by BE)
      await updateUserProfile(formData);

      // Simulate a successful response for testing
      setSuccess("Cập nhật thông tin thành công!");
      setOpenSnackbar(true);
      setIsEditing(false);

      // If avatar is updated, simulate uploading it
      if (selectedFile) {
        await handleAvatarUpload();
      }
    } catch (err) {
      // Log the error for debugging
      console.error("Profile update error:", err);
      setError("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
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
