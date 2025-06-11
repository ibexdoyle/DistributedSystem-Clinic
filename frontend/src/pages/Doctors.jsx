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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../layouts/Navbar';

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

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {currentDoctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                },
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Image Container with Fixed Aspect Ratio */}
              <Box 
                sx={{ 
                  width: '100%',
                  paddingTop: '100%', // 1:1 aspect ratio
                  position: 'relative',
                  backgroundColor: '#f5f5f5', // Light gray background while loading
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
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: 0
                  }}
                />
              </Box>
              <CardContent sx={{ 
                flexGrow: 1, 
                p: 3, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 100px)', // Adjust based on your needs
                minHeight: '180px' // Ensure minimum height for consistency
              }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                    minHeight: '1.4em' // Ensure consistent height for one line
                  }}>
                    {doctor.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" sx={{
                    fontWeight: 500,
                    mb: 1,
                    minHeight: '2.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {doctor.specialty}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    minHeight: '1.5em' // Ensure consistent height
                  }}>
                    {doctor.experience}
                  </Typography>
                </Box>
                <CardActions sx={{ 
                  justifyContent: 'center', 
                  p: 0, 
                  mt: 'auto',
                  pt: 1,
                  '& .MuiButton-root': {
                    width: '100%',
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    ĐẶT LỊCH KHÁM
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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