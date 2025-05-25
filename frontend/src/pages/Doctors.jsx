import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  Pagination,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const doctors = [
  {
    name: 'BS. Nguyễn Văn A',
    specialty: 'Chuyên khoa Răng Hàm Mặt',
    experience: '15 năm kinh nghiệm',
    image: '/assets/bs1.png',
    alt: 'Bác sĩ Nguyễn Văn A',
  },
  {
    name: 'BS. Trần Thị B',
    specialty: 'Chuyên viên chỉnh nha',
    experience: '10 năm kinh nghiệm',
    image: '/assets/bs2.jpg',
    alt: 'Bác sĩ Trần Thị B',
  },
  {
    name: 'BS. Lê Văn C',
    specialty: 'Chuyên viên phục hình răng',
    experience: '12 năm kinh nghiệm',
    image: '/assets/bs3.jpg',
    alt: 'Bác sĩ Lê Văn C',
  },
  {
    name: 'BS. Phạm Thị D',
    specialty: 'Chuyên viên nha chu',
    experience: '8 năm kinh nghiệm',
    image: '/assets/bs4.png',
    alt: 'Bác sĩ Phạm Thị D',
  },
  {
    name: 'BS. Nguyễn Văn E',
    specialty: 'Chuyên khoa Răng Hàm Mặt',
    experience: '9 năm kinh nghiệm',
    image: '/assets/bs5.jpg',
    alt: 'Bác sĩ Nguyễn Văn E',
  },
  {
    name: 'BS. Trần Thị F',
    specialty: 'Chuyên viên chỉnh nha',
    experience: '11 năm kinh nghiệm',
    image: '/assets/bs6.jpg',
    alt: 'Bác sĩ Trần Thị F',
  },
  {
    name: 'BS. Lê Văn G',
    specialty: 'Chuyên viên phục hình răng',
    experience: '7 năm kinh nghiệm',
    image: '/assets/bs7.jpg',
    alt: 'Bác sĩ Lê Văn G',
  },
  {
    name: 'BS. Phạm Thị H',
    specialty: 'Chuyên viên nha chu',
    experience: '14 năm kinh nghiệm',
    image: '/assets/bs8.jpg',
    alt: 'Bác sĩ Phạm Thị H',
  },
];

const Doctors = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const isPatient = user?.role === 'patient';
  const isGuest = !isAuthenticated;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter doctors based on search term (name or specialty)
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

  const handleBookAppointment = (doctor) => {
    if (!isAuthenticated) {
      setSelectedDoctor(doctor);
      setOpenLoginDialog(true);
    } else if (user?.role === 'patient') {
      navigate('/appointments', { state: { selectedDoctor: doctor } });
    }
  };

  const handleLogin = () => {
    setOpenLoginDialog(false);
    navigate('/login', { state: { from: '/doctors', selectedDoctor } });
  };

  const handleClose = () => {
    setOpenLoginDialog(false);
    setSelectedDoctor(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Đội ngũ bác sĩ
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Tìm theo tên hoặc chuyên khoa..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {currentDoctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <Avatar
                alt={doctor.alt}
                src={doctor.image}
                sx={{ width: 150, height: 150, mb: 2 }}
                onError={(e) => {
                  console.error(`Failed to load image for ${doctor.name}`);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <CardContent sx={{ textAlign: 'center', flexGrow: 1, width: '100%' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {doctor.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {doctor.specialty}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {doctor.experience}
                </Typography>
                {(isPatient || isGuest) && (
                  <CardActions sx={{ width: '100%', mt: 'auto', px: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleBookAppointment(doctor)}
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      Đặt lịch khám
                    </Button>
                  </CardActions>
                )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {filteredDoctors.length > itemsPerPage && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              <ArrowBackIosIcon />
            </IconButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button 
                key={page} 
                variant={currentPage === page ? 'contained' : 'outlined'} 
                onClick={() => handlePageChange(page)} 
                sx={{ minWidth: 40 }}
              >
                {page}
              </Button>
            ))}
            <IconButton 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}

        {/* Login Dialog */}
        <Dialog 
          open={openLoginDialog}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth 
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle 
            id="alert-dialog-title"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              py: 2,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              '& .MuiSvgIcon-root': {
                mr: 1.5,
              },
            }}
          >
            <AccountCircle />
            <span>Yêu cầu đăng nhập</span>
          </DialogTitle>

          <DialogContent sx={{ py: 3, px: 4 }}>
            <Box textAlign="center" mb={3}>
              <LockOutlinedIcon 
                color="primary"
                sx={{ fontSize: 64, mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Đăng nhập để tiếp tục
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng đăng nhập để đặt lịch khám với bác sĩ{' '}
                <Box component="span" fontWeight="bold" color="primary.main">
                  {selectedDoctor?.name}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Chưa có tài khoản? Bạn sẽ được chuyển hướng đến trang đăng ký sau khi nhấn Đăng nhập
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button 
              onClick={handleLogin} 
              variant="contained" 
              color="primary"
              autoFocus
            >
              Đăng nhập
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
};

// Add default placeholder for doctor images
const loadFallbackImage = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://via.placeholder.com/150';
};

export default Doctors;