import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Prescriptions = () => {
  // Sẽ bổ sung UI tạo đơn thuốc, cập nhật trạng thái...
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Quản lý đơn thuốc</Typography>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="text.secondary">Chức năng này sẽ được bổ sung UI chi tiết (tạo đơn thuốc, cập nhật trạng thái...)</Typography>
      </Box>
    </Container>
  );
};

export default Prescriptions;
