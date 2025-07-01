import React, { useState } from 'react';
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
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../layouts/Navbar';

const doctors = [
  {
    name: 'BS. Nguyễn Văn A',
    specialty: 'Chuyên khoa Răng Hàm Mặt',
    experience: '15 năm kinh nghiệm',
    image: require('../assets/bs1.png'),
    alt: 'Bác sĩ Nguyễn Văn A',
  },
  {
    name: 'BS. Trần Thị B',
    specialty: 'Chuyên viên chỉnh nha',
    experience: '10 năm kinh nghiệm',
    image: require('../assets/bs2.jpg'),
    alt: 'Bác sĩ Trần Thị B',
  },
  {
    name: 'BS. Lê Văn C',
    specialty: 'Chuyên viên phục hình răng',
    experience: '12 năm kinh nghiệm',
    image: require('../assets/bs3.jpg'),
    alt: 'Bác sĩ Lê Văn C',
  },
  {
    name: 'BS. Phạm Thị D',
    specialty: 'Chuyên viên nha chu',
    experience: '8 năm kinh nghiệm',
    image: require('../assets/bs4.jpg'),
    alt: 'Bác sĩ Phạm Thị D',
  },
  {
    name: 'BS. Nguyễn Văn E',
    specialty: 'Chuyên khoa Răng Hàm Mặt',
    experience: '9 năm kinh nghiệm',
    image: require('../assets/bs5.png'),
    alt: 'Bác sĩ Nguyễn Văn E',
  },
  {
    name: 'BS. Trần Thị F',
    specialty: 'Chuyên viên chỉnh nha',
    experience: '11 năm kinh nghiệm',
    image: require('../assets/bs6.jpg'),
    alt: 'Bác sĩ Trần Thị F',
  },
  {
    name: 'BS. Lê Văn G',
    specialty: 'Chuyên viên phục hình răng',
    experience: '7 năm kinh nghiệm',
    image: require('../assets/bs7.jpg'),
    alt: 'Bác sĩ Lê Văn G',
  },
  {
    name: 'BS. Phạm Thị H',
    specialty: 'Chuyên viên nha chu',
    experience: '14 năm kinh nghiệm',
    image: require('../assets/bs8.jpg'),
    alt: 'Bác sĩ Phạm Thị H',
  },
  {
    name: 'BS.CK1. Phạm Thị H',
    specialty: 'Chuyên khoa 1 Nhi - Dinh dưỡng',
    experience: '14 năm kinh nghiệm',
    image: require('../assets/bs9.jpg'),
    alt: 'Bác sĩ Phạm Thị H',
  },
  {
    name: 'GS.TS.BS. Trần Văn G',
    specialty: 'Chuyên khoa 2 Thần kinh - Đột quỵ',
    experience: '14 năm kinh nghiệm',
    image: require('../assets/bs10.jpg'),
    alt: 'Bác sĩ Phạm Thị H',
  },
  {
    name: 'BS. Phạm Thị P hfj',
    specialty: 'Chuyên viên nha chu',
    experience: '14 năm kinh nghiệm',
    image: require('../assets/bs11.jpg'),
    alt: 'Bác sĩ Phạm Thị H',
  },
  {
    name: 'BS. Phạm Thị JJN',
    specialty: 'Chuyên khoa 1 Tai Mũi Họng',
    experience: '14 năm kinh nghiệm',
    image: require('../assets/bs12.jpg'),
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  // Preload images to prevent flickering
  const preloadImages = (imageUrls) => {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  // Preload all doctor images on component mount
  React.useEffect(() => {
    const imageUrls = doctors.map(doctor => doctor.image);
    preloadImages(imageUrls);
  }, []);

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
                    e.target.src = 'https://via.placeholder.com/300x300?text=Doctor+Photo';
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
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => handleBookAppointment(doctor)}
                    disabled={!isPatient && !isGuest}
                    sx={{
                      py: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {isGuest ? 'Đăng nhập để đặt lịch' : 'Đặt lịch hẹn'}
                  </Button>
                </Box>
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
  e.target.src = 'https://via.placeholder.com/150';
};

export default Doctors;