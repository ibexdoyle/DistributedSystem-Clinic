import React from 'react';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Room as RoomIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const Footer = () => {
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
              Nha khoa chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại, mang đến nụ cười tỏa sáng cho mọi khách hàng.
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
            © {new Date().getFullYear()} Bệnh viện quốc tế VinMec Phú Quốc. Tất cả các quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
