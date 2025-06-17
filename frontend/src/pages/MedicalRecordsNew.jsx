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
  DialogActions,
  IconButton,
  Divider,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  MedicalServices as MedicalServicesIcon,
  Close as CloseIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  LocalPharmacy as LocalPharmacyIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getAppointmentsByPatient } from '../mock/appointmentsDB';

const MedicalRecordsNew = () => {
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin người dùng từ localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const username = user.username || '';
        
        if (username) {
          // Lấy danh sách lịch hẹn đã khám
          const appointments = getAppointmentsByPatient(username)
            .filter(appt => appt.status === 'Đã khám')
            .map(appt => ({
              ...appt,
              formattedDate: format(parseISO(appt.date), 'dd/MM/yyyy', { locale: vi }),
              doctorName: appt.doctorName || 'Bác sĩ chưa xác định',
              specialty: appt.specialty || 'Không có thông tin',
              diagnosis: appt.diagnosis || 'Chưa có chẩn đoán',
              // Mock data cho đơn thuốc
              medicines: [
                { id: 1, name: 'Paracetamol 500mg', quantity: '2 vỉ', usage: 'Uống 1 viên/lần, ngày 3 lần sau ăn' },
                { id: 2, name: 'Amoxicillin 500mg', quantity: '1 hộp', usage: 'Uống 1 viên/lần, ngày 2 lần sau ăn' },
                { id: 3, name: 'Vitamin C 100mg', quantity: '1 lọ', usage: 'Uống 1 viên/ngày sau ăn sáng' }
              ]
            }));
          
          setMedicalRecords(appointments);
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử khám bệnh:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewPrescription = (record) => {
    setSelectedRecord(record);
    setPrescriptionOpen(true);
  };

  const handleClosePrescription = () => {
    setPrescriptionOpen(false);
    setSelectedRecord(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Lịch sử khám bệnh
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Xem lại thông tin các lần khám bệnh trước đây
            </Typography>
          </Box>
        </Box>
      </Paper>


      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <MedicalServicesIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            DANH SÁCH KHÁM BỆNH
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày khám</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chuyên khoa</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bác sĩ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chuẩn đoán</TableCell>
                <TableCell sx={{ width: '150px', fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalRecords.length > 0 ? (
                medicalRecords.map((record, index) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.formattedDate}</TableCell>
                    <TableCell>{record.specialty}</TableCell>
                    <TableCell>{record.doctorName}</TableCell>
                    <TableCell sx={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.diagnosis}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<LocalPharmacyIcon />}
                        onClick={() => handleViewPrescription(record)}
                      >
                        Xem đơn thuốc
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      Chưa có dữ liệu lịch sử khám bệnh
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      {/* Dialog hiển thị đơn thuốc */}
      <Dialog 
        open={prescriptionOpen} 
        onClose={handleClosePrescription} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
      >
        {selectedRecord && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.5
            }}>
              <Box display="flex" alignItems="center">
                <MedicalServicesIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  ĐƠN THUỐC
                </Typography>
              </Box>
              <IconButton onClick={handleClosePrescription} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Box>
                {/* Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                  <Box textAlign="center" mb={2}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      PHÒNG KHÁM ĐA KHOA MEDPRO
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Đường ABC, Quận 1, TP.HCM - ĐT: (028) 1234 5678
                    </Typography>
                  </Box>
                  
                  <Box textAlign="center" my={2}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ĐƠN THUỐC
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (Dành cho bệnh nhân ngoại trú)
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Họ tên:</strong> {selectedRecord.patientName || '--'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ngày sinh:</strong> {selectedRecord.patientDob ? format(new Date(selectedRecord.patientDob), 'dd/MM/yyyy') : '--'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Địa chỉ:</strong> {selectedRecord.patientAddress || '--'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Số phiếu:</strong> {selectedRecord.id || '--'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ngày khám:</strong> {selectedRecord.formattedDate || '--'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Khoa khám:</strong> {selectedRecord.specialty || '--'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Chẩn đoán */}
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>
                    <DescriptionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    CHẨN ĐOÁN:
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 4, whiteSpace: 'pre-line' }}>
                    {selectedRecord.diagnosis || 'Chưa có thông tin chẩn đoán'}
                  </Typography>
                </Box>
                
                {/* Đơn thuốc */}
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>
                    <LocalPharmacyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    ĐƠN THUỐC:
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                          <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>STT</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Tên thuốc</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Số lượng</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Cách dùng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRecord.medicines && selectedRecord.medicines.length > 0 ? (
                          selectedRecord.medicines.map((medicine, index) => (
                            <TableRow key={medicine.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell>{medicine.quantity}</TableCell>
                              <TableCell>{medicine.usage}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                              <Typography color="text.secondary">
                                Không có thông tin đơn thuốc
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Hướng dẫn sử dụng */}
                  <Box mt={3}>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={1}>
                      HƯỚNG DẪN SỬ DỤNG:
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 2, fontStyle: 'italic' }}>
                      - Uống thuốc đúng liều lượng và thời gian quy định
                      <br />
                      - Tái khám theo lịch hẹn của bác sĩ
                      <br />
                      - Liên hệ ngay với bác sĩ nếu có bất thường
                    </Typography>
                  </Box>
                </Box>
                
                {/* Footer */}
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  </Typography>
                  <Typography variant="h6" color="primary" mt={2}>
                    BÁC SĨ ĐIỀU TRỊ
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedRecord.doctorName || '--'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleClosePrescription}
                sx={{ minWidth: '120px' }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MedicalRecordsNew;
