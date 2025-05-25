import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box
} from '@mui/material';

const MyMedicalRecords = () => {
  // Mock data - Thay thế bằng dữ liệu thực từ API
  const medicalRecords = [
    {
      id: 1,
      date: '24/05/2024',
      doctor: 'BS. Nguyễn Văn A',
      diagnosis: 'Viêm họng cấp',
      prescription: 'Thuốc kháng sinh, giảm đau',
      note: 'Uống thuốc đúng giờ, tái khám sau 5 ngày'
    },
    {
      id: 2,
      date: '15/04/2024',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Cảm cúm thông thường',
      prescription: 'Thuốc hạ sốt, vitamin C',
      note: 'Nghỉ ngơi nhiều, uống đủ nước'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Hồ sơ bệnh án cá nhân
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
          Thông tin bệnh nhân
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          <div>
            <Typography variant="subtitle2" color="text.secondary">Họ và tên</Typography>
            <Typography>Nguyễn Văn Bệnh Nhân</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="text.secondary">Ngày sinh</Typography>
            <Typography>01/01/1990</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="text.secondary">Giới tính</Typography>
            <Typography>Nam</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
            <Typography>0901234567</Typography>
          </div>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
        Lịch sử khám bệnh
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="medical records table">
          <TableHead>
            <TableRow>
              <TableCell>Ngày khám</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Chuẩn đoán</TableCell>
              <TableCell>Đơn thuốc</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.prescription}</TableCell>
                <TableCell>{record.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyMedicalRecords;
