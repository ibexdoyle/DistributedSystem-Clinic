import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { 
  Search, 
  Person,
  LocalHospital,
  CalendarToday,
  Phone,
  Email,
  LocationOn,
  Male,
  Female,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PatientsPage = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      patientId: 'BN0001',
      name: 'Nguyễn Văn A',
      gender: 'male',
      dob: '1990-01-15',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      bloodType: 'A+',
      lastVisit: '2025-06-01',
      status: 'active'
    },
    {
      id: 2,
      patientId: 'BN0002',
      name: 'Trần Thị B',
      gender: 'female',
      dob: '1985-08-22',
      phone: '0987654321',
      email: 'tranthib@example.com',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      bloodType: 'O+',
      lastVisit: '2025-05-28',
      status: 'active'
    },
    // Add more sample patients as needed
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
          Quản lý bệnh nhân
        </Typography>
        
        <TextField
          size="small"
          placeholder="Tìm kiếm bệnh nhân..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã BN</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Thông tin liên hệ</TableCell>
                <TableCell>Lần khám gần nhất</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{patient.patientId || `BN${patient.id.toString().padStart(4, '0')}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          {patient.gender === 'male' ? <Male /> : <Female />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{patient.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.gender === 'male' ? 'Nam' : 'Nữ'}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()} tuổi
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{patient.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{patient.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(patient.lastVisit), 'dd/MM/yyyy', { locale: vi })}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        color={patient.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => viewPatientDetails(patient)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy bệnh nhân nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog 
          open={!!selectedPatient} 
          onClose={() => setSelectedPatient(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {selectedPatient.gender === 'male' ? <Male /> : <Female />}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedPatient.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPatient.gender === 'male' ? 'Nam' : 'Nữ'}, {new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} tuổi
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ mr: 1 }} /> Thông tin sức khỏe
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Nhóm máu:</strong> {selectedPatient.bloodType || 'Chưa cập nhật'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Dị ứng:</strong> Không
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Bệnh nền:</strong> Không
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1 }} /> Lịch sử khám bệnh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lần khám gần nhất: {format(new Date(selectedPatient.lastVisit), 'dd/MM/yyyy', { locale: vi })}
              </Typography>
              {/* Add medical history list here */}
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} /> Thông tin liên hệ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Điện thoại:</strong> {selectedPatient.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedPatient.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {selectedPatient.address}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedPatient(null)}>Đóng</Button>
            <Button variant="contained">Tạo đơn thuốc mới</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default PatientsPage;
