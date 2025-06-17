import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Card, CardContent, styled, IconButton, Avatar, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import EastIcon from '@mui/icons-material/East';
import { LocalHospital as LocalHospitalIcon, Groups as GroupsIcon, Person as PersonIcon, Star as StarIcon, StarBorder as StarBorderIcon, MedicalServices as MedicalServicesIcon, MedicalInformation as MedicalInformationIcon, SupportAgent as SupportAgentIcon, Language as LanguageIcon } from '@mui/icons-material';
import BannerSlider from '../components/BannerSlider';

import khamchuyenkhoa from '../assets/khamchuyenkhoa.jpg';

const Home = () => {
    // Sử dụng ảnh có sẵn trong thư mục assets
    const defaultDoctor = require('../assets/bs1.png');
    const defaultService = require('../assets/Service1.png');
    const defaultBanner = require('../assets/banner_1.jpg');

    // Định nghĩa các ảnh sẽ sử dụng, thay thế bằng ảnh mặc định nếu không tìm thấy
    const bs1 = require('../assets/bs5.png');
    const bs2 = require('../assets/bs6.jpg');
    const bs3 = require('../assets/bs7.jpg');
    const congnghe1 = require('../assets/congnghe1.jpg');
    const congnghe2 = require('../assets/congnghe2.jpg');
    const congnghe3 = require('../assets/congnghe3.jpg');
    const congnghe4 = require('../assets/congnghe4.jpg');

    // Dữ liệu banner và dịch vụ
    const bannerData = {
        mainBanner: {
            src: require('../assets/bannerVinMec.jpg'),
            alt: 'Bệnh viện Đa khoa Quốc tế Phú Quốc',
            title: 'CHĂM SÓC SỨC KHỎE TOÀN DIỆN',
            subtitle: 'Đội ngũ bác sĩ chuyên nghiệp - Cơ sở vật chất hiện đại',
            buttonText: 'ĐẶT LỊCH KHÁM NGAY'
        },
        services: [{
                id: 1,
                title: 'KHÁM CHUYÊN KHOA',
                description: 'Khám và điều trị các chuyên khoa',
                icon: khamchuyenkhoa,
                color: '#4caf50'
            },
            {
                id: 2,
                title: 'KHÁM TỪ XA',
                description: 'Bác sĩ tư vấn trực tuyến',
                icon: khamchuyenkhoa,
                color: '#2196f3'
            },
            {
                id: 3,
                title: 'KHÁM TỔNG QUÁT',
                description: 'Kiểm tra sức khỏe định kỳ',
                icon: khamchuyenkhoa,
                color: '#ff9800'
            },
            {
                id: 4,
                title: 'XÉT NGHIỆM Y HỌC',
                description: 'Xét nghiệm chính xác, nhanh chóng',
                icon: khamchuyenkhoa,
                color: '#9c27b0'
            }
        ]
    };

    // Dữ liệu giới thiệu nhanh
    const introData = [{
            icon: require('../assets/img1.svg'),
            title: 'ĐỘI NGŨ CHUYÊN GIA',
            description: 'Hơn 100 bác sĩ chuyên khoa đầu ngành, giàu kinh nghiệm, tận tâm với nghề',
            color: '#1976d2'
        },
        {
            icon: require('../assets/img2.svg'),
            title: 'CƠ SỞ VẬT CHẤT HIỆN ĐẠI',
            description: 'Hệ thống phòng khám, phòng mổ vô khuẩn một chiều, trang thiết bị y tế đồng bộ, hiện đại, đạt tiêu chuẩn quốc tế',
            color: '#2e7d32'
        },
        {
            icon: require('../assets/img3.svg'),
            title: 'DỊCH VỤ CHĂM SÓC TẬN TÂM',
            description: 'Đội ngũ nhân viên chuyên nghiệp, tận tình, chu đáo, luôn sẵn sàng phục vụ 24/7',
            color: '#ed6c02'
        },
        {
            icon: require('../assets/img4.svg'),
            title: 'HỆ THỐNG QUẢN LÝ HIỆN ĐẠI',
            description: 'Ứng dụng công nghệ thông tin trong quản lý và điều trị, đảm bảo tính chính xác và bảo mật thông tin bệnh nhân',
            color: '#9c27b0'
        }
    ];

    // Component Divider tùy chỉnh
    const Divider = styled('div')({
        height: '4px',
        width: '100px',
        backgroundColor: '#1976d2',
        margin: '0 auto 20px',
        borderRadius: '2px'
    });

    return ( <
        Box > { /* Banner chính */ } <
        Box sx = {
            { position: 'relative' } } > { /* Banner lớn */ } <
        Box sx = {
            {
                height: { xs: '400px', md: '600px' },
                position: 'relative',
                overflow: 'hidden'
            }
        } >
        <
        Box component = "img"
        src = { bannerData.mainBanner.src }
        alt = { bannerData.mainBanner.alt }
        sx = {
            {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
            }
        }
        onError = {
            (e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x600?text=Banner+Image';
            }
        }
        /> { /* Overlay text và nút */ } <
        Box sx = {
            {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                p: 4
            }
        } >
        <
        Container maxWidth = "lg" >
        <
        Box sx = {
            { maxWidth: '600px' } } >
        <
        Typography variant = "h4"
        component = "div"
        sx = {
            {
                color: 'white',
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }
        } >
        Bệnh Viện Đa Khoa VinMec Phú Quốc <
        /Typography> <
        Typography variant = "h3"
        component = "h1"
        sx = {
            {
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
            }
        } >
        CHĂM SÓC SỨC KHỎE CỦA BẠN VỚI ĐỘI NGŨ BÁC SĨ CHUYÊN NGHIỆP <
        /Typography> <
        /Box> <
        /Container> <
        /Box> <
        /Box>

        { /* Các thẻ dịch vụ */ } <
        // Container maxWidth = "lg"
        // sx = {
        //     { mt: -6, position: 'relative', zIndex: 1 } } >
        // <
        // Grid container spacing = { 3 }
        // justifyContent = "center" > {
        //     bannerData.services.map((service) => ( <
        //         Grid item xs = { 12 }
        //         sm = { 6 }
        //         md = { 3 }
        //         key = { service.id } >
        //         <
        //         Card sx = {
        //             {
        //                 height: '100%',
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 alignItems: 'center',
        //                 textAlign: 'center',
        //                 p: 3,
        //                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        //                 borderTop: `4px solid ${service.color}`,
        //                 transition: 'transform 0.3s',
        //                 '&:hover': {
        //                     transform: 'translateY(-5px)'
        //                 }
        //             }
        //         } >
        //         <
        //         Box sx = {
        //             {
        //                 width: 60,
        //                 height: 60,
        //                 borderRadius: '50%',
        //                 backgroundColor: `${service.color}20`,
        //                 display: 'flex',
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //                 mb: 2
        //             }
        //         } >
        //         <
        //         img src = { service.icon }
        //         alt = { service.title }
        //         style = {
        //             {
        //                 width: 32,
        //                 height: 32,
        //                 objectFit: 'contain'
        //             }
        //         }
        //         /> <
        //         /Box> <
        //         Typography variant = "h6"
        //         component = "h3"
        //         sx = {
        //             {
        //                 fontWeight: 'bold',
        //                 mb: 1,
        //                 color: '#333'
        //             }
        //         } > { service.title } <
        //         /Typography> <
        //         Typography variant = "body2"
        //         color = "text.secondary" > { service.description } <
        //         /Typography> <
        //         /Card> <
        //         /Grid>
        //     ))
        // } <
        // /Grid> <
        // /Container> <
        /Box>

        { /* Block giới thiệu Vinmec Phú Quốc */ } <
        Container id = "gioi-thieu"
        maxWidth = "lg"
        sx = {
            { mt: 6, mb: 6, scrollMarginTop: '80px' } } >
        <
        Box sx = {
            {
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                alignItems: 'center',
                my: 8,
                gap: 6
            }
        } >
        <
        Box sx = {
            {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }
        } >
        <
        Typography variant = "h3"
        component = "h1"
        gutterBottom sx = {
            {
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                textAlign: { xs: 'center', md: 'left' },
                color: '#1976d2',
                lineHeight: 1.3
            }
        } >
        TẠI SAO LỰA CHỌN VINMEC PHÚ QUỐC ?
        <
        /Typography>

        <
        Box sx = {
            {
                mb: 4,
                '& p, & li': {
                    fontSize: '1.1rem',
                    color: '#555',
                    lineHeight: 1.8,
                    mb: 2,
                    textAlign: { xs: 'left', md: 'left' },
                    position: 'relative',
                    pl: '28px'
                },
                '& li:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '12px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#1976d2',
                    borderRadius: '50%'
                }
            }
        } >

        <
        Box component = "ul"
        sx = {
            { pl: 0, listStyle: 'none', mb: 3 } } >
        <
        li > Hệ thống phòng mổ vô khuẩn một chiều < /li> <
        li > Hệ thống phòng bệnh tiêu chuẩn khách sạn 5 sao < /li> <
        li > Hệ thống xét nghiệm tự động hóa hoàn toàn < /li> <
        li > Hệ thống chẩn đoán hình ảnh hiện đại : MRI 3.0 Tesla, CT 640 dãy, X - quang kỹ thuật số, siêu âm đàn hồi mô... < /li> <
        /Box>


        <
        /Box>

        <
        Box sx = {
            {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: 4,
                '& > *': {
                    flex: '0 0 auto',
                    maxWidth: '100%'
                }
            }
        } >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f0f7ff',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                mr: 2,
                mb: 2
            }
        } >
        <
        MedicalServicesIcon color = "primary"
        sx = {
            { fontSize: '1.5rem', mr: 1 } }
        /> <
        Typography > Đội ngũ bác sĩ giỏi < /Typography> <
        /Box> <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f0f7ff',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                mr: 2,
                mb: 2
            }
        } >
        <
        MedicalInformationIcon color = "primary"
        sx = {
            { fontSize: '1.5rem', mr: 1 } }
        /> <
        Typography > Trang thiết bị hiện đại < /Typography> <
        /Box> <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f0f7ff',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                mb: 2
            }
        } >
        <
        SupportAgentIcon color = "primary"
        sx = {
            { fontSize: '1.5rem', mr: 1 } }
        /> <
        Typography > Dịch vụ tận tâm < /Typography> <
        /Box> <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f0f7ff',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                mb: 2
            }
        } >
        <
        LanguageIcon color = "primary"
        sx = {
            { fontSize: '1.5rem', mr: 1 } }
        /> <
        Typography > Chất lượng quốc tế < /Typography> <
        /Box> <
        /Box>

        <
        Box sx = {
            {
                display: 'flex',
                gap: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2
            }
        } >

        <
        /Box> <
        /Box>

        <
        Box sx = {
            {
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                maxWidth: { xs: '100%', md: '50%' },
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                    zIndex: 1,
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                },
                '&:hover:before': {
                    opacity: 1,
                }
            }
        } >
        <
        Box component = "img"
        src = { require('../assets/taisaochonVinMec.png') }
        alt = "Bệnh viện Đa khoa Vinmec Phú Quốc"
        sx = {
            {
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '16px',
                transition: 'transform 0.5s ease',
                '&:hover': {
                    transform: 'scale(1.02)'
                }
            }
        }
        /> <
        /Box> <
        /Box> <
        /Container>

        {
            /* Block Tại sao chọn Vinmec Phú Quốc
                <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
                  <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                      <Typography variant="h3" component="h2" sx={{ 
                        color: '#2d3b4e',
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        lineHeight: 1.2
                      }}>
                        TẠI SAO CHỌN VINMEC PHÚ QUỐC?
                      </Typography>
                      <Divider />
                      <Typography variant="h6" sx={{ 
                        color: '#6c757d',
                        maxWidth: '800px',
                        mx: 'auto',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        mb: 4
                      }}>
                        Vinmec Phú Quốc tự hào mang đến dịch vụ y tế chất lượng cao với đội ngũ chuyên gia hàng đầu và hệ thống trang thiết bị hiện đại
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: '#2d3b4e',
                        maxWidth: '900px',
                        mx: 'auto',
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        backgroundColor: 'white',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                      }}>
                        Vinmec Phú Quốc tự hào là địa chỉ chăm sóc sức khỏe tin cậy với đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm và tận tâm. Chúng tôi cam kết mang đến cho khách hàng những dịch vụ y tế chất lượng cao nhất, đáp ứng mọi nhu cầu chăm sóc sức khỏe từ cơ bản đến chuyên sâu. Với hệ thống trang thiết bị hiện đại, không gian khám chữa bệnh tiện nghi và quy trình khám chữa bệnh chuyên nghiệp, Vinmec Phú Quốc luôn nỗ lực mang đến sự hài lòng tối đa cho mọi khách hàng.
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={4}>
                      {introData.map((item, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={index}>
                          <Box sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 4,
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }
                          }}>
                            <Box sx={{
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              backgroundColor: `${item.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 4,
                              '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.3s ease'
                              }
                            }}>
                              <img 
                                src={item.icon} 
                                alt={item.title}
                                style={{ 
                                  width: 50,
                                  height: 50,
                                  objectFit: 'contain'
                                }}
                              />
                            </Box>
                            <Typography 
                              variant="h5" 
                              component="h3" 
                              sx={{ 
                                color: '#2d3b4e',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: '1.25rem',
                                lineHeight: 1.3,
                                minHeight: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#6c757d',
                                lineHeight: 1.8,
                                fontSize: '1rem'
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </Box> */
        }

        { /* Block thống kê nhanh */ } {
            /* <Container maxWidth="lg" sx={{ mt: 0, mb: 6 }}>
                  <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={4}>
                      <Paper elevation={4} sx={{ p: 3, textAlign: 'center' }}>
                        <LocalHospitalIcon color="primary" sx={{ fontSize: 48 }} />
                        <Typography variant="h4" fontWeight={700}>123</Typography>
                        <Typography>Chuyên gia bác sĩ</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={4} sx={{ p: 3, textAlign: 'center' }}>
                        <GroupsIcon color="success" sx={{ fontSize: 48 }} />
                        <Typography variant="h4" fontWeight={700}>1234</Typography>
                        <Typography>Nhân viên y tế</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={4} sx={{ p: 3, textAlign: 'center' }}>
                        <PersonIcon color="info" sx={{ fontSize: 48 }} />
                        <Typography variant="h4" fontWeight={700}>12345</Typography>
                        <Typography>Bệnh nhân phục vụ</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Container> */
        }

        { /* Giới thiệu */ } {
            /* <Box sx={{ py: 8, bgcolor: '#f9f9f9' }}>
                  <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6, color: '#1976d2' }}>
                      BỆNH VIỆN ĐA KHOA QUỐC TẾ
                    </Typography>
                    <Grid container spacing={6} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          Chăm sóc sức khỏe toàn diện - Vì một cộng đồng khỏe mạnh
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Bệnh viện Đa khoa Quốc tế với hệ thống cơ sở vật chất hiện đại, 
                          đội ngũ giáo sư, bác sĩ đầu ngành cùng dịch vụ chăm sóc y tế chất lượng cao.
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Chúng tôi cam kết mang đến cho bệnh nhân những dịch vụ y tế tốt nhất 
                          với tiêu chuẩn quốc tế và chi phí hợp lý nhất.
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large"
                          component={Link}
                          to="/gioi-thieu"
                          sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                        >
                          Tìm hiểu thêm
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <img 
                          src={sukhacbiet1} 
                          alt="Bệnh viện hiện đại" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }} 
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </Box> */
        }

        { /* Đội ngũ bác sĩ chuyên môn */ } <
        Box sx = {
            { py: 8, bgcolor: 'white' } } >
        <
        Container maxWidth = "lg" >
        <
        Typography variant = "h4"
        component = "h2"
        align = "center"
        gutterBottom sx = {
            { fontWeight: 'bold', mb: 6, color: '#1976d2' } } >
        Đội ngũ bác sĩ chuyên môn <
        /Typography> <
        Grid container spacing = { 4 }
        sx = {
            { display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' } } > {
            [{
                    image: bs1,
                    title: 'Bs.Nguyễn Văn A',
                    description: 'Chuyên khoa Răng Hàm Mặt'
                },
                {
                    image: bs2,
                    title: 'Bs.Nguyễn Văn B',
                    description: 'Chuyên khoa Tâm lý'
                },
                {
                    image: bs3,
                    title: 'Bs.Nguyễn Văn C',
                    description: 'Chuyên khoa Ngoại Tổng Quát'
                }
            ].map((item, index) => ( <
                Grid item xs = { 4 }
                key = { index }
                sx = {
                    { flex: '0 0 33.333%', display: 'flex', justifyContent: 'center' } } >
                <
                Box sx = {
                    { 
                        textAlign: 'center', 
                        px: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '100%',
                        height: '100%',
                        justifyContent: 'space-between'
                    } } >
                <
                Box sx = {
                    { 
                        width: '100%',
                        maxWidth: '300px',
                        height: '250px', 
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 3,
                        mb: 3,
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)'
                        }
                    } } >
                <
                Box 
                    component = "img"
                    src = { item.image }
                    alt = { item.title }
                    sx = {
                        { 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', 
                            display: 'block'
                        }
                    }
                />
                </Box>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            mb: 1, 
                            color: '#333',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {item.title}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {item.description}
                    </Typography>
                </Box>
            </Box>
        </Grid>
            ))}
            </Grid>
        </Container>
        
        {/* Nút Xem thêm */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 8 }}>
            <Button 
                component={Link}
                to="/doctors"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                Xem thêm
                
            </Button>
        </Box>
    </Box>

        {
            /* <Box sx={{ py: 8, bgcolor: '#f9f9f9' }}>
                  <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ĐỘI NGŨ CHUYÊN GIA
                      </Typography>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Bác Sĩ Đầu Ngành
                      </Typography>
                      <Box sx={{ width: 80, height: 3, bgcolor: '#1976d2', mx: 'auto', mt: 2 }} />
                    </Box>
                    <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {[require('../assets/bs1.png'), 
                        require('../assets/bs2.jpg'), 
                        require('../assets/bs3.jpg'), 
                        require('../assets/bs4.jpg')].map((img, index) => (
                        <Grid item xs={6} sm={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box 
                            component="img"
                            src={img}
                            alt={`Công nghệ ${index + 1}`}
                            sx={{
                              width: '100%',
                              maxWidth: '200px',
                              height: 'auto',
                              objectFit: 'contain',
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </Box> */
        }

        { /* Block mới */ } {
            /* <Box sx={{ py: 8, backgroundColor: '#1976d2', color: 'white' }}>
                  <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
                          ĐẶT LỊCH KHÁM VỚI BÁC SĨ CHUYÊN KHOA
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3, lineHeight: 1.8 }}>
                          Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm, tận tâm với nghề. Chúng tôi cam kết mang đến cho bạn dịch vụ y tế chất lượng cao nhất.
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          size="large"
                          component={Link}
                          to="/dat-lich-kham"
                          sx={{ 
                            mt: 2, 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            borderRadius: '50px',
                            backgroundColor: 'white',
                            color: '#1976d2',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            }
                          }}
                        >
                          ĐẶT LỊCH NGAY
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          component="img"
                          src={require('../assets/bs1.png')}
                          alt="Bác sĩ tư vấn"
                          sx={{
                            width: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.02)'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </Box> */
        }

        { /* Dịch vụ y tế */ } {
            /* <Box sx={{ py: 8, bgcolor: 'white' }}>
                  <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                        DỊCH VỤ NỔI BẬT
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
                        Các dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại
                      </Typography>
                      <Box sx={{ width: 80, height: 3, bgcolor: '#1976d2', mx: 'auto', mt: 2 }} />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      overflowX: 'auto',
                      gap: 3,
                      py: 3,
                      px: 2,
                      '&::-webkit-scrollbar': {
                        height: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '10px',
                        '&:hover': {
                          background: '#555',
                        },
                      },
                    }}>
                      {[
                        { 
                          img: require('../assets/bannerVinMec.jpg').default, 
                          title: 'KHÁM CHUYÊN KHOA',
                          description: 'Khám và điều trị các chuyên khoa: Nội tổng quát, Nhi, Sản phụ khoa, Tai Mũi Họng, Da liễu, Xương khớp...',
                          readMore: 'Xem thêm'
                        },
                        { 
                          img: require('../assets/bannerVinMec2.png').default, 
                          title: 'KHÁM TẠI NHÀ',
                          description: 'Dịch vụ khám bệnh tại nhà tiện lợi, phù hợp với người cao tuổi, trẻ nhỏ và bệnh nhân khó di chuyển...',
                          readMore: 'Xem thêm'
                        },
                        { 
                          img: require('../assets/bannerVinMec3.png').default, 
                          title: 'XÉT NGHIỆM - CHẨN ĐOÁN HÌNH ẢNH',
                          description: 'Hệ thống máy móc xét nghiệm và chẩn đoán hình ảnh hiện đại, cho kết quả chính xác và nhanh chóng...',
                          readMore: 'Xem thêm'
                        }
                      ].map((item, index) => (
                        <Card 
                          key={index}
                          sx={{ 
                            minWidth: 300,
                            maxWidth: 350,
                            height: '100%',
                            flex: '0 0 auto',
                            boxShadow: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s',
                            '&:hover': {
                              transform: 'translateY(-5px)'
                            }
                          }}
                        >
                          <Box 
                            component="img" 
                            src={item.img} 
                            alt={item.title} 
                            sx={{ 
                              width: '100%', 
                              height: 200, 
                              objectFit: 'cover' 
                            }} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/350x200?text=Image+Not+Found';
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                              {item.description}
                            </Typography>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small" 
                              sx={{ 
                                alignSelf: 'flex-start',
                                textTransform: 'none', 
                                fontWeight: 'bold',
                                '&:hover': {
                                  backgroundColor: 'primary.main',
                                  color: 'white'
                                }
                              }}
                            >
                              {item.readMore}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Container>
                </Box> */
        }

        </Box>
    );
}

export default Home;