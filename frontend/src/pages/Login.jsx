import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Link, 
  Dialog,
  DialogTitle, 
  DialogContent, 
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  
  // Auto hide success/error messages after 5 seconds
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleOpenRegister = (e) => {
    if (e) e.preventDefault();
    setOpenRegister(true);
  };

  const handleCloseRegister = (e) => {
    if (e) e.preventDefault();
    setOpenRegister(false);
    setError('');
    setSuccess('');
  };

  const handleOpenForgotPassword = (e) => {
    if (e) e.preventDefault();
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = (e) => {
    if (e) e.preventDefault();
    setOpenForgotPassword(false);
    setError('');
    setSuccess('');
    setShowOtpField(false);
    setShowNewPasswordField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const user = await onLogin({ 
        username, 
        password
      });
      
      if (user.role === 'patient') {
        navigate(from, { replace: true });
      } else if (user.role === 'doctor') {
        navigate('/doctor/appointments', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(phone);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không đúng định dạng!');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call for registration with delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          const isSuccess = Math.random() > 0.3; // 70% success rate for demo
          isSuccess ? resolve() : reject();
        }, 1500);
      });
      
      // On success
      const successMsg = 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.';
      setSuccess(successMsg);
      
      // Reset form after a short delay
      setTimeout(() => {
        setOpenRegister(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      }, 2000);
      
    } catch (err) {
      // Different error messages for different scenarios
      const errorMessages = [
        'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
        'Số điện thoại đã được sử dụng. Vui lòng kiểm tra lại.',
        'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
      ];
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      setError(randomError);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!showOtpField && !showNewPasswordField) {
      // Step 1: Request OTP
      if (!email) {
        setError('Vui lòng nhập địa chỉ email');
        return;
      }
      
      if (!validateEmail(email)) {
        setError('Email không hợp lệ!');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        // Simulate API call to send OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowOtpField(true);
        setSuccess('Mã xác nhận đã được gửi đến email của bạn');
      } catch (err) {
        setError('Không tìm thấy tài khoản với email này');
      } finally {
        setIsLoading(false);
      }
    } else if (showOtpField && !showNewPasswordField) {
      // Step 2: Verify OTP
      if (!otp) {
        setError('Vui lòng nhập mã xác nhận');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        // Simulate API call to verify OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowNewPasswordField(true);
        setSuccess('Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.');
      } catch (err) {
        setError('Mã xác nhận không đúng. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 3: Set new password
      if (!newPassword) {
        setError('Vui lòng nhập mật khẩu mới');
        return;
      }
      
      if (newPassword.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        // Simulate API call to reset password
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
        setOpenForgotPassword(false);
        // Reset form
        setEmail('');
        setOtp('');
        setNewPassword('');
        setShowOtpField(false);
        setShowNewPasswordField(false);
      } catch (err) {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
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
            severity={error ? 'error' : 'success'} 
            sx={{ mb: 3 }}
            onClose={() => error ? setError('') : setSuccess('')}
          >
            {error || success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập hoặc Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              href="#" 
              variant="body2" 
              onClick={(e) => {
                e.preventDefault();
                handleOpenRegister();
              }}
              style={{ cursor: 'pointer' }}
            >
              Bạn chưa có tài khoản? Đăng ký ngay
            </Link>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              href="#" 
              variant="body2" 
              onClick={(e) => {
                e.preventDefault();
                handleOpenForgotPassword();
              }}
              style={{ cursor: 'pointer' }}
            >
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
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>
      
      {/* Register Dialog */}
      <Dialog 
        open={openRegister} 
        onClose={handleCloseRegister} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2,
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: 'bold'
        }}>
          ĐĂNG KÝ TÀI KHOẢN
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {(error || success) && (
            <Alert 
              severity={error ? 'error' : 'success'}
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => error ? setError('') : setSuccess('')}
            >
              {error || success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label="Họ và tên"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="normal"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              size="small"
              sx={{ mb: 2 }}
              placeholder="VD: 0912345678"
            />
            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              size="small"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderRadius: 1,
                boxShadow: 'none',
                mb: 2,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
              size="large"
            >
              {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ TÀI KHOẢN'}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Bằng cách đăng ký, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
            </Typography>
          </Box>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Đã có tài khoản?{' '}
              <Link 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleCloseRegister();
                }}
                sx={{ fontWeight: 'bold' }}
              >
                Đăng nhập ngay
              </Link>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Forgot Password Dialog */}
      <Dialog 
        open={openForgotPassword} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Quên mật khẩu</Typography>
            <IconButton onClick={handleCloseForgotPassword}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {!showOtpField && !showNewPasswordField 
              ? 'Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận đến email của bạn.'
              : showOtpField && !showNewPasswordField
              ? 'Vui lòng nhập mã xác nhận đã gửi đến email của bạn.'
              : 'Vui lòng nhập mật khẩu mới cho tài khoản của bạn.'}
          </Typography>
          
          <form onSubmit={handleForgotPassword}>
            {!showOtpField && !showNewPasswordField && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email đăng ký"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                sx={{ mb: 2 }}
              />
            )}
            
            {showOtpField && !showNewPasswordField && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mã xác nhận (6 chữ số)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                disabled={isLoading}
                sx={{ mb: 2 }}
              />
            )}
            
            {showNewPasswordField && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mật khẩu mới"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 2 }}
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
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ py: 1.5, mb: 2 }}
              size="large"
            >
              {isLoading 
                ? 'Đang xử lý...' 
                : showNewPasswordField 
                  ? 'Đặt lại mật khẩu'
                  : showOtpField
                    ? 'Xác nhận mã'
                    : 'Gửi mã xác nhận'}
            </Button>
            
            <Box textAlign="center">
              <Button 
                color="primary" 
                size="small"
                onClick={() => {
                  setOpenForgotPassword(false);
                  setShowOtpField(false);
                  setShowNewPasswordField(false);
                  setEmail('');
                  setOtp('');
                  setNewPassword('');
                  setError('');
                }}
              >
                Quay lại đăng nhập
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;
