import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

const MyMedicalRecords = () => {
  const { user } = useAuth();
  const [patientInfo, setPatientInfo] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const res = await fetch(`http://localhost:8082/api/patients?email=${encodeURIComponent(user?.email)}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatientInfo(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch patient info', err);
      }
    };

    if (user?.email) {
      fetchPatientInfo();
    }
  }, [user]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch(`http://localhost:8084/api/medical-records?patientId=${patientInfo?.id}`);
        const data = await res.json();
        setMedicalRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch medical records', err);
      }
    };

    if (patientInfo?.id) {
      fetchMedicalRecords();
    }
  }, [patientInfo]);

  const handleOpenPrescriptionDialog = (record) => {
    setPrescriptionDialogOpen(true);
    setSelectedPrescription(record);
  };

  const handleClosePrescriptionDialog = () => {
    setPrescriptionDialogOpen(false);
    setSelectedPrescription(null);
  };
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
            <Typography sx={{ fontWeight: 'bold', color: 'primary.main', whiteSpace: 'nowrap' }}>{patientInfo?.id || '---'}</Typography>
          </Box>
          <Box sx={{ minWidth: '180px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Họ và tên</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{patientInfo?.fullName || '---'}</Typography>
          </Box>
          <Box sx={{ minWidth: '120px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Ngày sinh</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{formatDate(patientInfo?.dob)}</Typography>
            </Box>
          <Box sx={{ minWidth: '80px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Giới tính</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{patientInfo?.gender === 'male' ? 'Nam' : patientInfo?.gender === 'female' ? 'Nữ' : 'Khác'}</Typography>
          </Box>
          <Box sx={{ minWidth: '140px', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mb: 0.5 }}>Số điện thoại</Typography>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{patientInfo?.phoneNumber || '---'}</Typography>
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