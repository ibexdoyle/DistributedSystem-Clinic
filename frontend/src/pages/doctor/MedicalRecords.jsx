import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  LocalPharmacy as LocalPharmacyIcon
} from '@mui/icons-material';

// Mock data for patients
const mockPatients = [
  {
    id: 1,
    patientId: 'BN0001',
    name: 'Nguyễn Văn A',
    age: 35,
    gender: 'Nam',
    phone: '0987654321',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    lastVisit: '2023-05-15',
    diagnosis: 'Viêm họng cấp',
    status: 'Đang điều trị',
    records: [
      {
        id: 101,
        date: '2023-05-15',
        doctor: 'BS. Trần Văn B',
        diagnosis: 'Viêm họng cấp',
        symptoms: 'Đau họng, sốt nhẹ, khó nuốt',
        treatment: 'Kê đơn thuốc kháng sinh, hạ sốt',
        notes: 'Tái khám sau 7 ngày nếu không đỡ'
      },
      {
        id: 102,
        date: '2023-04-10',
        doctor: 'BS. Lê Thị C',
        diagnosis: 'Cảm cúm thông thường',
        symptoms: 'Sốt, đau đầu, sổ mũi',
        treatment: 'Thuốc cảm, hạ sốt',
        notes: 'Nghỉ ngơi, uống nhiều nước'
      }
    ]
  },
  // Add more mock patients as needed
];

const MedicalRecords = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewRecordDialog, setOpenNewRecordDialog] = useState(false);
  const [view, setView] = useState('patient'); // 'patient' or 'record'
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setView('patient');
    setOpenDialog(true);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setView('record');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setSelectedRecord(null);
    setView('patient');
  };

  const filteredPatients = mockPatients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchTerm) ||
      patient.diagnosis.toLowerCase().includes(searchLower) ||
      (patient.patientId && patient.patientId.toLowerCase().includes(searchLower))
    );
  });

  const navigate = useNavigate();
  
  const handleCreatePrescription = (patient) => {
    // Chuyển hướng đến trang tạo đơn thuốc với ID bệnh nhân
    navigate(`/doctor/prescriptions/new?patientId=${patient.id}`, {
      state: {
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender
        },
        appointmentId: selectedRecord?.id // Truyền ID lịch hẹn nếu có
      }
    });
  };

  const handleCreateNewRecord = () => {
    // Tạo hồ sơ mới cho bệnh nhân
    const newRecordEntry = {
      id: Date.now(),
      date: newRecord.date,
      doctor: 'BS. Người dùng hiện tại', // Có thể lấy từ thông tin đăng nhập
      diagnosis: newRecord.diagnosis,
      symptoms: newRecord.symptoms,
      treatment: newRecord.treatment,
      notes: newRecord.notes
    };

    // Cập nhật danh sách bệnh nhân với hồ sơ mới
    const updatedPatients = mockPatients.map(patient => {
      if (patient.id === selectedPatient.id) {
        return {
          ...patient,
          records: [newRecordEntry, ...patient.records],
          lastVisit: newRecord.date,
          diagnosis: newRecord.diagnosis,
          status: 'Đang điều trị'
        };
      }
      return patient;
    });

    // Ứng dụng thực tế sẽ gọi API để lưu dữ liệu
    console.log('Tạo hồ sơ mới:', newRecordEntry);
    
    // Đóng dialog và reset form
    setOpenNewRecordDialog(false);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      symptoms: '',
      treatment: '',
      notes: ''
    });
    
    // Cập nhật UI (trong ứng dụng thực tế sẽ cập nhật từ response của API)
    // Ở đây chỉ là demo nên dùng mock data
    setSelectedPatient({
      ...selectedPatient,
      records: [newRecordEntry, ...selectedPatient.records],
      lastVisit: newRecord.date,
      diagnosis: newRecord.diagnosis,
      status: 'Đang điều trị'
    });
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPatients.length) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý hồ sơ bệnh án
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Danh sách bệnh nhân</Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm theo tên, mã BN hoặc số điện thoại..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            helperText="Nhập tên, mã BN (ví dụ: BN0001) hoặc số điện thoại"
          />
        </Box>


        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã BN</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Tuổi/Giới tính</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Lần khám gần nhất</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredPatients
              ).map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell>{patient.patientId || `BN${patient.id.toString().padStart(4, '0')}`}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age} tuổi / {patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.diagnosis}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.status}
                      color={
                        patient.status === 'Đang điều trị' ? 'primary' :
                        patient.status === 'Đã khỏi' ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
          }
        />
      </Paper>

      {/* Patient Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {view === 'record' ? (
              <IconButton onClick={() => setView('patient')} size="small">
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <div></div>
            )}
            <Typography variant="h6">
              {view === 'patient' ? 'Thông tin bệnh nhân' : 'Chi tiết hồ sơ bệnh án'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {view === 'patient' && selectedPatient && (
            <Box>
              <Box display="flex" mb={3}>
                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                  {selectedPatient.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedPatient.name}</Typography>
                  <Typography color="textSecondary">
                    {selectedPatient.age} tuổi • {selectedPatient.gender}
                  </Typography>
                  <Typography color="textSecondary">
                    {selectedPatient.phone}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Địa chỉ</Typography>
                  <Typography>{selectedPatient.address}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Lần khám gần nhất</Typography>
                  <Typography>{selectedPatient.lastVisit}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Chẩn đoán gần nhất</Typography>
                  <Typography>{selectedPatient.diagnosis}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Trạng thái</Typography>
                  <Chip
                    label={selectedPatient.status}
                    color={
                      selectedPatient.status === 'Đang điều trị' ? 'primary' :
                      selectedPatient.status === 'Đã khỏi' ? 'success' : 'default'
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Lịch sử khám bệnh</Typography>
              {selectedPatient.records.map((record) => (
                <Card key={record.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle1">
                        {record.date}
                      </Typography>
                      <Chip 
                        label="Xem chi tiết" 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        onClick={() => handleViewRecord(record)}
                        clickable
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Bác sĩ: {record.doctor}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      Chẩn đoán: {record.diagnosis}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          
          {view === 'record' && selectedRecord && (
            <Box>
              <Typography variant="h6" gutterBottom>Thông tin chi tiết</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Ngày khám</Typography>
                  <Typography>{selectedRecord.date}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Bác sĩ</Typography>
                  <Typography>{selectedRecord.doctor}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Triệu chứng</Typography>
                  <Typography>{selectedRecord.symptoms}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Chẩn đoán</Typography>
                  <Typography>{selectedRecord.diagnosis}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Điều trị</Typography>
                  <Typography>{selectedRecord.treatment}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Ghi chú</Typography>
                  <Typography>{selectedRecord.notes || 'Không có ghi chú'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Đóng
          </Button>
          {view === 'patient' && selectedPatient && (
            <>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => handleCreatePrescription(selectedPatient)}
                startIcon={<LocalPharmacyIcon />}
                sx={{ mr: 1 }}
              >
                Kê đơn thuốc
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setOpenNewRecordDialog(true)}
                sx={{ ml: 1 }}
              >
                Tạo hồ sơ mới
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog tạo hồ sơ mới */}
      <Dialog 
        open={openNewRecordDialog} 
        onClose={() => setOpenNewRecordDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tạo hồ sơ bệnh án mới</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày khám"
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Triệu chứng"
                multiline
                rows={2}
                value={newRecord.symptoms}
                onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chẩn đoán"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phác đồ điều trị"
                multiline
                rows={3}
                value={newRecord.treatment}
                onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={2}
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRecordDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleCreateNewRecord} 
            variant="contained" 
            color="primary"
            disabled={!newRecord.diagnosis}
          >
            Lưu hồ sơ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecords;