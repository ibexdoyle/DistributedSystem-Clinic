import React, { useState, useEffect, useContext } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const from = location.state?.from?.pathname || "/";

  // Điều hướng khi user context đổi
  useEffect(() => {
    if (user) {
      if (user.role === 'DOCTOR' || user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else if (user.role === 'ADMIN' || user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [user]);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(
        location.state.message || `Đăng ký tài khoản ${location.state.email} thành công! Vui lòng đăng nhập.`
      );
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(`Đăng ký tài khoản ${location.state.email} thành công! Vui lòng đăng nhập.`);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await login({ email, password });
      // Không navigate ở đây, sẽ navigate trong useEffect khi user context đổi
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
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

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError("")} 
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage("")}
            sx={{ mb: 2 }}
          >
            {successMessage}
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

          <Box textAlign="center" mt={2}>
            <Link component={RouterLink} to="/register" variant="body2" underline="hover">
              Bạn chưa có tài khoản? Đăng ký ngay
            </Link>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Link href="#" variant="body2" onClick={(e) => e.preventDefault()}>
              Quên mật khẩu?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, height: 44 }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
