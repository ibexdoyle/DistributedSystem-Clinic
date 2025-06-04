import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MedicalRecords = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hồ sơ bệnh án
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6">Danh sách hồ sơ bệnh án</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Nội dung hồ sơ bệnh án sẽ được hiển thị tại đây.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MedicalRecords;
