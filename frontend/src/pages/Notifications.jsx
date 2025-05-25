import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Notifications = () => {
  // Sẽ bổ sung UI gửi/thông báo, danh sách thông báo...
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Thông báo</Typography>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="text.secondary">Chức năng này sẽ được bổ sung UI chi tiết (gửi thông báo, xem thông báo...)</Typography>
      </Box>
    </Container>
  );
};

export default Notifications;
