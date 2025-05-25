import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const news = [
  {
    id: 1,
    title: 'Công nghệ trồng răng Implant mới nhất 2025',
    excerpt: 'Công nghệ trồng răng Implant All-on-4 đã có mặt tại Nha khoa Sài Gòn...',
    date: '15/05/2025',
    image: '/news/implant.jpg',
    category: 'Công nghệ mới'
  },
  {
    id: 2,
    title: 'Những điều cần biết về niềng răng ở người trưởng thành',
    excerpt: 'Niềng răng không chỉ dành cho trẻ em mà người trưởng thành vẫn có thể...',
    date: '10/05/2025',
    image: '/news/nieng-rang.jpg',
    category: 'Kiến thức'
  },
  {
    id: 3,
    title: 'Chăm sóc răng miệng đúng cách cho trẻ em',
    excerpt: 'Hướng dẫn cách chăm sóc răng miệng cho trẻ từ khi mọc chiếc răng đầu tiên...',
    date: '05/05/2025',
    image: '/news/tre-em.jpg',
    category: 'Chăm sóc răng miệng'
  },
  {
    id: 4,
    title: 'Khuyến mãi đặc biệt tháng 5/2025',
    excerpt: 'Giảm 20% chi phí tẩy trắng răng và 15% chi phí trám răng thẩm mỹ...',
    date: '01/05/2025',
    image: '/news/khuyen-mai.jpg',
    category: 'Khuyến mãi'
  }
];

const News = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tin tức
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {news.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <CardMedia
                component="img"
                sx={{ width: 200, display: { xs: 'none', sm: 'block' } }}
                image={item.image}
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x150';
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="subtitle2" color="primary" gutterBottom>
                    {item.category}
                  </Typography>
                  <Typography component="div" variant="h6">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    {item.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.date}
                    </Typography>
                    <Button size="small" color="primary">
                      Xem thêm
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default News;
