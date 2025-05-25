import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

const services = [
  {
    title: 'Khám tổng quát',
    description: 'Kiểm tra sức khỏe răng miệng toàn diện và tư vấn điều trị.'
  },
  {
    title: 'Trám răng thẩm mỹ',
    description: 'Khắc phục răng sâu, mẻ, thưa bằng vật liệu nha khoa cao cấp.'
  },
  {
    title: 'Tẩy trắng răng',
    description: 'Làm trắng răng an toàn, hiệu quả với công nghệ hiện đại.'
  },
  {
    title: 'Niềng răng',
    description: 'Chỉnh nha thẩm mỹ cho hàm răng đều đẹp, chuẩn khớp cắn.'
  }
];

const Services = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dịch vụ
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
