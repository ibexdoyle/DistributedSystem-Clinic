import React from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, Divider } from '@mui/material';
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form liên hệ
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Liên hệ
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Thông tin liên hệ
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography>123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Typography>0929 456 789</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography>info@nhakhoasaigon.com</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography>Thứ 2 - Thứ 7: 8:00 - 20:00</Typography>
                  <Typography>Chủ nhật: 8:00 - 12:00</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.023086263051!2d106.69970341533422!3d10.73282226236054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f8b8d9f4f4b%3A0x4e91f9b7f3a0f6b1!2sNha%20Khoa%20Sai%20Gon!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Bản đồ Nha khoa Sài Gòn"
              ></iframe>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Gửi tin nhắn cho chúng tôi
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Họ và tên"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Số điện thoại"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Tiêu đề"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nội dung"
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Gửi tin nhắn
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
