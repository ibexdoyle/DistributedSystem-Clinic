import React, { useState } from 'react';
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
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
      note: 'Uống thuốc đúng giờ, tái khám sau 5 ngày',
      medicines: [
        { id: 1, name: 'Thuốc kháng sinh', quantity: '2 viên/lần', usage: 'Uống 3 lần/ngày' },
        { id: 2, name: 'Thuốc giảm đau', quantity: '1 viên/lần', usage: 'Uống khi cần' }
      ]
    },
    {
      id: 2,
      date: '15/04/2024',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Cảm cúm thông thường',
      prescription: 'Thuốc hạ sốt, vitamin C',
      note: 'Nghỉ ngơi nhiều, uống đủ nước',
      medicines: [
        { id: 1, name: 'Thuốc hạ sốt', quantity: '1 viên/lần', usage: 'Uống khi cần' },
        { id: 2, name: 'Vitamin C', quantity: '1 viên/lần', usage: 'Uống 1 lần/ngày' }
      ]
    }
  ];

  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleOpenPrescriptionDialog = (record) => {
    setPrescriptionDialogOpen(true);
    setSelectedPrescription(record);
  };

  const handleClosePrescriptionDialog = () => {
    setPrescriptionDialogOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Hồ sơ bệnh án
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1.5 }}>
          Thông tin bệnh nhân
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: '180px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Mã bệnh nhân</Typography>
            <Typography sx={{ fontWeight: 'bold', color: 'primary.main', whiteSpace: 'nowrap' }}>BN123456</Typography>
          </Box>
          <Box sx={{ minWidth: '180px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Họ và tên</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>Nguyễn Văn An</Typography>
          </Box>
          <Box sx={{ minWidth: '120px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Ngày sinh</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>01/01/1990</Typography>
          </Box>
          <Box sx={{ minWidth: '80px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Giới tính</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>Nam</Typography>
          </Box>
          <Box sx={{ minWidth: '140px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Số điện thoại</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>0901234567</Typography>
          </Box>
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
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleOpenPrescriptionDialog(record)}
                  >
                    Xem đơn thuốc
                  </Button>
                </TableCell>
                <TableCell>{record.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog hiển thị chi tiết đơn thuốc */}
      <Dialog 
        open={prescriptionDialogOpen} 
        onClose={handleClosePrescriptionDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPrescription && (
          <>
            <DialogTitle>Đơn thuốc</DialogTitle>
            <DialogContent>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
                  ĐƠN THUỐC
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    <strong>Ngày khám:</strong> {selectedPrescription.date}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Bác sĩ:</strong> {selectedPrescription.doctor}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Chuẩn đoán:</strong> {selectedPrescription.diagnosis}
                  </Typography>
                </Box>

                <Box sx={{ borderTop: '1px solid #e0e0e0', my: 2 }}></Box>
                
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Đơn thuốc:
                </Typography>
                
                {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    {selectedPrescription.medicines.map((medicine, index) => (
                      <Box key={medicine.id || index} sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {medicine.name} - {medicine.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cách dùng:</strong> {medicine.usage}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Không có thông tin thuốc
                  </Typography>
                )}

                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Lời dặn của bác sĩ:
                  </Typography>
                  <Typography variant="body2">
                    {selectedPrescription.prescription || 'Không có lời dặn'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePrescriptionDialog} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyMedicalRecords;
