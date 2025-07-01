import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';

const Home = () => {
    // Dữ liệu dịch vụ
    const services = [
        {
            id: 1,
            title: 'KHÁM CHUYÊN KHOA',
            description: 'Khám và điều trị các chuyên khoa',
            icon: '🏥',
            color: '#4caf50',
            height: '180px'
        },
        {
            id: 2,
            title: 'KHÁM TỪ XA',
            description: 'Bác sĩ tư vấn trực tuyến',
            icon: '💻',
            color: '#2196f3',
            height: '180px'
        },
        {
            id: 3,
            title: 'KHÁM TỔNG QUÁT',
            description: 'Kiểm tra sức khỏe định kỳ',
            icon: '🩺',
            color: '#ff9800',
            height: '180px'
        },
        {
            id: 4,
            title: 'XÉT NGHIỆM Y HỌC',
            description: 'Xét nghiệm chính xác, nhanh chóng',
            icon: '🔬',
            color: '#9c27b0',
            height: '180px'
        }
    ];

    return (
        <Box>
            {/* Banner chính */}
            <Box sx={{ backgroundColor: '#1976d2', py: 8, color: 'white' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Bệnh Viện Đa Khoa VinMec Phú Quốc
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px' }}>
                        Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên nghiệp và cơ sở vật chất hiện đại
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large"
                        component={Link}
                        to="/dat-lich"
                        sx={{ 
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem'
                        }}
                    >
                        ĐẶT LỊCH KHÁM NGAY
                    </Button>
                </Container>
            </Box>

            {/* Dịch vụ nổi bật */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" component="h2" sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        color: '#1976d2',
                        textTransform: 'uppercase',
                        position: 'relative',
                        display: 'inline-block',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: '60px',
                            height: '3px',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#1976d2',
                            borderRadius: '3px'
                        }
                    }}>
                        Dịch vụ nổi bật
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth="700px" mx="auto">
                        Các dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên môn giỏi, trang thiết bị hiện đại
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {services.map((service) => (
                        <Grid item xs={12} sm={6} md={3} key={service.id}>
                            <Card 
                                elevation={3} 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease-in-out',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        height: '150px',
                                        background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}90 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
                                        }
                                    }}
                                >
                                    <Box 
                                        component="span"
                                        sx={{ 
                                            fontSize: '4rem',
                                            lineHeight: 1,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                </Box>
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3,
                                    height: service.height || 'auto',
                                    minHeight: '180px',
                                    '&:last-child': {
                                        pb: 3
                                    }
                                }}>
                                    <Typography 
                                        gutterBottom 
                                        variant="h6" 
                                        component="h3"
                                        sx={{ 
                                            fontWeight: 700,
                                            color: service.color,
                                            mb: 1.5,
                                            fontSize: '1.1rem',
                                            lineHeight: 1.3,
                                            minHeight: '3em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            mb: 3,
                                            flexGrow: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {service.description}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        sx={{
                                            borderColor: service.color,
                                            color: service.color,
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: `${service.color}15`,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 8px ${service.color}40`,
                                                borderColor: service.color
                                            }
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
