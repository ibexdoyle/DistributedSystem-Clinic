import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Link 
} from '@mui/material';
import { Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';

const About = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" color="primary" fontWeight="bold" gutterBottom>
            Bệnh viện Đa khoa Vinmec Phú Quốc
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <LocationOn color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="textSecondary">
              Khu bãi Dài, Xã Gành Dầu, Thành phố Phú Quốc, Tỉnh Kiên Giang, Việt Nam
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" fontWeight="bold">
            <Phone sx={{ verticalAlign: 'middle', mr: 1 }} />
            0297 3985 588
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Giới thiệu chung */}
        <Box mb={6}>
          <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold">
            Giới thiệu
          </Typography>
          <Typography paragraph variant="h6" color="textSecondary">
            Chính thức đi vào hoạt động từ tháng 6 năm 2015, Bệnh viện Đa khoa Vinmec Phú Quốc được xây dựng trong khuôn viên rộng tới hơn 10.000 m2 với 6 tầng nổi, quy mô gần 150 giường bệnh, 11 phòng chức năng và 10 chuyên khoa cùng hệ thống máy móc, trang thiết bị y tế hiện đại trên thế giới.
          </Typography>
          <Typography paragraph variant="h6" color="textSecondary">
            Tọa lạc trên hòn đảo du lịch xinh đẹp tại Việt Nam, Bệnh viện Đa khoa Vinmec Phú Quốc được thiết kế và xây dựng hài hòa cùng thiên nhiên, đảm bảo yêu cầu mỹ quan, tối ưu hóa việc sử dụng ánh sáng thiên nhiên, thân thiện với môi trường, mang đến một không gian nghỉ ngơi, dưỡng bệnh lý tưởng cho tất cả các khách hàng.
          </Typography>
          <Typography paragraph variant="h6" color="textSecondary">
            Với lợi thế là một trong những thành viên của Hệ thống Y tế hiện đại tại Việt Nam, Bệnh viện Đa khoa Vinmec Phú Quốc vận hành theo bộ tiêu chuẩn uy tín thế giới (JCI) về chất lượng dịch vụ y tế, chất lượng khám chữa bệnh, hướng tới mục tiêu vì sự an toàn cho người bệnh.
          </Typography>
          <Typography paragraph variant="h6" color="textSecondary">
            Đặc biệt, Vinmec Phú Quốc quy tụ đội ngũ bác sĩ, chuyên gia đến từ nhiều bệnh viện uy tín trong nước và quốc tế, luôn không ngừng nỗ lực nghiên cứu, ứng dụng các kỹ thuật y học mới trong chẩn đoán và điều trị bệnh. Bệnh viện ĐKQT Vinmec Phú Quốc đã và đang là địa chỉ khám chữa bệnh tin cậy, đạt tiêu chuẩn quốc tế, đem đến sự hài lòng cho người dân đang sinh sống và làm việc tại Phú Quốc cũng như khách du lịch trong và ngoài nước.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Thời gian khám */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
                  Thời gian khám
                </Typography>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Phòng khám chuyên khoa (Nội, Ngoại, Sản, Nhi, Vaccine)
                  </Typography>
                  <Box pl={2}>
                    <Typography>Thứ 2 đến thứ 6: Sáng: 8:00-12:00; Chiều: 13:00-17:00</Typography>
                    <Typography>Thứ 7: Sáng: 8:00-12:00</Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold">
                  Hồi sức cấp cứu: 24/24 (Bao gồm thứ 7, Chủ Nhật, các ngày lễ/ Tết)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Thông tin liên hệ */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
                  Thông tin liên hệ
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Hotline" 
                      secondary={
                        <Link href="tel:02973985588" color="primary" underline="hover">
                          0297 3985 588
                        </Link>
                      } 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cấp cứu" 
                      secondary={
                        <Link href="tel:02973985511" color="primary" underline="hover">
                          0297 398 55 11
                        </Link>
                      } 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={
                        <Link href="mailto:info.pq@vinmec.com" color="primary" underline="hover">
                          info.pq@vinmec.com
                        </Link>
                      } 
                    />
                  </ListItem>
                </List>
                
                {/* <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tài liệu liên quan:
                  </Typography>
                  <Box>
                    <Link href="#" color="primary" underline="hover" display="block" mb={1}>
                      Giấy phép xả nước thải vào nguồn nước Vinmec Phú Quốc
                    </Link>
                    <Link href="#" color="primary" underline="hover">
                      Kết quả quan trắc môi trường Vinmec Phú Quốc
                    </Link>
                  </Box>
                </Box> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
