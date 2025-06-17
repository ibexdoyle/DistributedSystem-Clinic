import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, IconButton, Fab, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Room as RoomIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const theme = useTheme();

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);
  return (
    <Box component="footer" sx={{ bgcolor: '#2c3e50', color: 'white', py: 1.5, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* About Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                bottom: '-10px',
                left: 0,
                backgroundColor: '#3498db',
                borderRadius: '3px'
              }
            }}>
              Về Chúng Tôi
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#bdc3c7' }}>
            Bệnh viện Vinmec là hệ thống y tế tiêu chuẩn quốc tế, cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên môn cao và trang thiết bị hiện đại. Chúng tôi cam kết mang đến sự an tâm và chất lượng cho mọi khách hàng.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white', '&:hover': { color: '#3498db' } }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>


          {/* Thêm cột khác nếu muốn */}
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #3d566e', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
            © {new Date().getFullYear()} Bệnh viện quốc tế VinMec Phú Quốc.
          </Typography>
        </Box>
      </Container>

      {/* Back to top button */}
      <Fade in={showScroll}>
        <Box
          onClick={scrollToTop}
          role="presentation"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            '&:hover': {
              cursor: 'pointer',
              '& .MuiFab-root': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease-in-out'
              }
            }
          }}
        >
          <Fab 
            color="primary" 
            size="medium" 
            aria-label="Lên đầu trang"
            sx={{
              boxShadow: '0 4px 10px 0 rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 15px 0 rgba(0,0,0,0.3)'
              }
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Box>
      </Fade>
    </Box>
  );
};

export default Footer;
