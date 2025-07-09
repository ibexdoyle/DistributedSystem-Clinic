import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions as MuiDialogActions,
  TextField,
  InputAdornment,
  Pagination,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../layouts/Navbar';
import staffService from '../services/staffService';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const isPatient = user?.role === 'patient';
  const isGuest = !isAuthenticated;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8083/api/staffs', {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter doctors from the staff list (role = DOCTOR)
        const doctorsList = Array.isArray(data) 
          ? data.filter(staff => staff.staffRole === 'DOCTOR')
          : [];

        const doctorsWithImages = doctorsList.map(doctor => ({
          ...doctor,
          image: getDoctorImage(doctor.department), // Using department as specialty
          alt: `Bác sĩ ${doctor.fullName}`,
          name: `BS. ${doctor.fullName}`,
          specialty: doctor.department || 'Chuyên khoa',
          experience: 'Nhiều năm kinh nghiệm' // Default experience text
        }));

        setDoctors(doctorsWithImages);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const getDoctorImage = (department) => {
    if (!department) {
      return 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';
    }

    // Map departments to appropriate images
    const departmentImages = {
      'tim mạch': 'https://img.freepik.com/free-photo/portrait-male-doctor-with-stethoscope_23-2149022743.jpg',
      'nội khoa': 'https://img.freepik.com/free-photo/portrait-female-doctor-with-stethoscope_23-2149022739.jpg',
      'ngoại khoa': 'https://img.freepik.com/free-photo/portrait-surgeon-with-surgical-mask_23-2148827773.jpg',
      'nhi khoa': 'https://img.freepik.com/free-photo/portrait-pediatrician-with-stethoscope_23-2149022762.jpg',
      'sản phụ khoa': 'https://img.freepik.com/free-photo/portrait-female-doctor-with-clipboard_23-2149022749.jpg',
      'tai mũi họng': 'https://img.freepik.com/free-photo/doctor-with-stethoscope-around-neck_23-2149022742.jpg',
      'da liễu': 'https://img.freepik.com/free-photo/portrait-female-dermatologist-with-magnifying-glass_23-2149022755.jpg',
      'răng hàm mặt': 'https://img.freepik.com/free-photo/portrait-male-dentist-white-coat_1303-21211.jpg',
      'mắt': 'https://img.freepik.com/free-photo/portrait-ophthalmologist-with-ophthalmoscope_23-2149022759.jpg',
      'xương khớp': 'https://img.freepik.com/free-photo/portrait-orthopedic-surgeon-with-x-ray_23-2149022765.jpg'
    };

    // Find matching department (case insensitive)
    const normalizedDept = department.toLowerCase();
    const matchedDept = Object.keys(departmentImages).find(dept => 
      normalizedDept.includes(dept)
    );

    return matchedDept 
      ? departmentImages[matchedDept]
      : 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';
  };

  const filteredDoctors = doctors.filter(
    doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  // Preload images to prevent flickering
  const preloadImages = (imageUrls) => {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  // Preload all doctor images when doctors data changes
  useEffect(() => {
    if (doctors.length > 0) {
      const imageUrls = doctors.map(doctor => doctor.image).filter(Boolean);
      preloadImages(imageUrls);
    }
  }, [doctors]);

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            textAlign: 'center',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
              margin: '16px auto 0',
              borderRadius: '2px'
            }
          }}
        >
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

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3,
        width: '100%'
      }}>
        {currentDoctors.map((doctor, index) => (
          <Box key={index} sx={{ display: 'flex' }}>
            <Card 
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                },
                borderRadius: '12px',
                overflow: 'hidden',
                // Sử dụng flex để các card có cùng chiều cao
                flex: '1 0 auto'
              }}
            >
              {/* Image Container with Fixed Aspect Ratio */}
              <Box 
                sx={{ 
                  width: '100%',
                  paddingTop: '100%', // 1:1 aspect ratio
                  position: 'relative',
                  backgroundColor: '#f8f9fa',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={doctor.image}
                  alt={doctor.alt}
                  loading="lazy"
                  onLoad={(e) => {
                    e.target.style.opacity = 1;
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${doctor.name}`);
                    e.target.onerror = null;
                    e.target.src = 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                    opacity: 0,
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>
              
              {/* Card Content */}
              <CardContent sx={{ 
                p: 3,
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                // Sử dụng flex để phân bổ không gian
                '& > *:not(:last-child)': {
                  mb: 2
                }
              }}>
                {/* Doctor Name */}
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    textAlign: 'center',
                    minHeight: '3em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& > *': {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.4
                    }
                  }}
                >
                  {doctor.name}
                </Typography>
                
                {/* Specialty */}
                <Typography 
                  variant="subtitle1" 
                  color="primary" 
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: theme.palette.primary.main,
                    minHeight: '4em',
                    '& > *': {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3
                    }
                  }}
                >
                  {doctor.specialty}
                </Typography>
                
                {/* Experience */}
                <Box sx={{ 
                  mt: 'auto',
                  pt: 2,
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}
                  >
                    {doctor.experience}
                  </Typography>
                </Box>
                
                {/* Book Button */}
                <CardActions sx={{ mt: 'auto', p: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => handleBookAppointment(doctor)}
                    sx={{
                      borderRadius: 0,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {isGuest ? 'Đặt lịch ngay' : isPatient ? 'Đặt lịch' : 'Xem chi tiết'}
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          sx={{ '& .MuiPagination-ul': { flexWrap: 'nowrap' } }}
        />
      </Box>
      </Container>

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
          }}
        >
          <span>Yêu cầu đăng nhập</span>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Đăng nhập để tiếp tục
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng đăng nhập để đặt lịch khám với bác sĩ{' '}
            <Box component="span" fontWeight="bold" color="primary.main">
              {selectedDoctor?.name}
            </Box>
          </Typography>
        </DialogContent>
        
        <MuiDialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ mr: 2, minWidth: 100 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleLogin} 
            color="primary" 
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            Đăng nhập
          </Button>
        </MuiDialogActions>
      </Dialog>
    </Box>
  );
};

// Add default placeholder for doctor images
const loadFallbackImage = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';
};

export default Doctors;