import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from "@mui/material";
import { Link } from "react-router-dom";

// Import assets
import khamchuyenkhoa from "../assets/khamchuyenkhoa.jpg";
import logoVinmec from "../assets/logoVinmec.svg";
import defaultDoctor from "../assets/bs1.png";
import defaultService from "../assets/Service1.png";
import defaultBanner from "../assets/banner_1.jpg";

const Home = () => {
  // Banner data
  const bannerData = {
    mainBanner: {
      src: logoVinmec,
      alt: "Bệnh viện Đa khoa Quốc tế Phú Quốc",
      title: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN",
      subtitle: "Đội ngũ bác sĩ chuyên nghiệp - Cơ sở vật chất hiện đại",
      buttonText: "ĐẶT LỊCH KHÁM NGAY"
    },
    services: [
      {
        id: 1,
        title: "KHÁM CHUYÊN KHOA",
        description: "Khám và điều trị các chuyên khoa",
        icon: khamchuyenkhoa,
        color: "#4caf50"
      },
      {
        id: 2,
        title: "KHÁM TỪ XA",
        description: "Bác sĩ tư vấn trực tuyến",
        icon: defaultService,
        color: "#2196f3"
      },
      {
        id: 3,
        title: "KHÁM TỔNG QUÁT",
        description: "Kiểm tra sức khỏe định kỳ",
        icon: defaultService,
        color: "#ff9800"
      },
      {
        id: 4,
        title: "XÉT NGHIỆM Y HỌC",
        description: "Xét nghiệm chính xác, nhanh chóng",
        icon: defaultService,
        color: "#9c27b0"
      }
    ]
  };

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{ 
        position: 'relative',
        height: '80vh',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${defaultBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            <img 
              src={bannerData.mainBanner.src} 
              alt={bannerData.mainBanner.alt} 
              style={{ maxWidth: '200px', marginBottom: '20px' }}
            />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {bannerData.mainBanner.title}
            </Typography>
            <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
              {bannerData.mainBanner.subtitle}
            </Typography>
            <Button 
              component={Link}
              to="/dat-lich-kham"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                padding: '12px 30px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {bannerData.mainBanner.buttonText}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: 'primary.main'
            }}
          >
            DỊCH VỤ NỔI BẬT
          </Typography>
          <Box 
            sx={{ 
              width: '80px', 
              height: '4px', 
              backgroundColor: 'primary.main', 
              margin: '0 auto 40px',
              borderRadius: '2px'
            }} 
          />
          
          <Grid container spacing={4}>
            {bannerData.services.map((service) => (
              <Grid item xs={12} sm={6} md={3} key={service.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    borderTop: `4px solid ${service.color}`
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={service.icon}
                    alt={service.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultService;
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" align="center">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {service.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/dich-vu/${service.id}`}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                VỀ CHÚNG TÔI
              </Typography>
              <Box 
                sx={{ 
                  width: '80px', 
                  height: '4px', 
                  backgroundColor: 'primary.main', 
                  mb: 3,
                  borderRadius: '2px'
                }} 
              />
              <Typography variant="body1" paragraph>
                Bệnh viện Đa khoa Quốc tế Phú Quốc tự hào là đơn vị y tế hàng đầu với đội ngũ bác sĩ chuyên môn cao, 
                trang thiết bị hiện đại, mang đến dịch vụ chăm sóc sức khỏe toàn diện cho cộng đồng.
              </Typography>
              <Typography variant="body1" paragraph>
                Với phương châm "Vì sức khỏe cộng đồng", chúng tôi không ngừng nâng cao chất lượng dịch vụ, 
                cập nhật các phương pháp điều trị tiên tiến nhất trên thế giới.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                to="/gioi-thieu"
                sx={{ mt: 2 }}
              >
                Tìm hiểu thêm
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src={defaultDoctor}
                alt="Đội ngũ bác sĩ"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: 3
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultDoctor;
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
