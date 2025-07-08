import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.token) {
        const { token, email, role, permissions } = response.data;

        // Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userPermissions", JSON.stringify(permissions));

        // Chuyển hướng sau khi đăng nhập
        navigate("/");
      } else {
        throw new Error("Không nhận được token từ máy chủ");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" color="primary" gutterBottom>
            Đăng nhập hệ thống
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng đăng nhập để tiếp tục
          </Typography>
        </Box>

        {(error || success) && (
          <Alert
            severity={error ? "error" : "success"}
            onClose={() => (error ? setError("") : setSuccess(""))}
            sx={{ mb: 3 }}
          >
            {error || success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            type="email"
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link href="#" variant="body2" onClick={(e) => e.preventDefault()}>
              Bạn chưa có tài khoản? Đăng ký ngay
            </Link>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Link href="#" variant="body2" onClick={(e) => e.preventDefault()}>
              Quên mật khẩu?
            </Link>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={isLoading}
            size="large"
            sx={{ mt: 1, py: 1.5 }}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
