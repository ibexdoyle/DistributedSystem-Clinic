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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize
} from '@mui/material';
import { 
  Search, 
  Add, 
  Edit, 
  Visibility,
  Close,
  LocalPharmacy,
  Refresh
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      date: '2025-06-03',
      status: 'pending',
      diagnosis: 'Viêm họng cấp',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: '2 lần/ngày', duration: '5 ngày' },
        { name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '7 ngày' }
      ]
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      date: '2025-06-02',
      status: 'completed',
      diagnosis: 'Cảm cúm',
      medicines: [
        { name: 'Tiffy', dosage: '1 viên', frequency: '3 lần/ngày', duration: '3 ngày' }
      ]
    },
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const handleCreatePrescription = () => {
    setSelectedPrescription({
      id: null,
      patientName: '',
      diagnosis: '',
      medicines: [],
      note: '',
      status: 'pending'
    });
    setOpenDialog(true);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleSavePrescription = () => {
    console.log('Lưu đơn thuốc:', selectedPrescription);
    setOpenDialog(false);
  };

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.duration) {
      setSelectedPrescription({
        ...selectedPrescription,
        medicines: [...selectedPrescription.medicines, newMedicine]
      });
      setNewMedicine({ name: '', dosage: '', frequency: '', duration: '' });
    }
  };

  const removeMedicine = (index) => {
    const updatedMedicines = [...selectedPrescription.medicines];
    updatedMedicines.splice(index, 1);
    setSelectedPrescription({
      ...selectedPrescription,
      medicines: updatedMedicines
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          <LocalPharmacy sx={{ verticalAlign: 'middle', mr: 1 }} />
          Quản lý đơn thuốc
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm đơn thuốc..."
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
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreatePrescription}
          >
            Tạo đơn thuốc
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.length > 0 ? (
                prescriptions
                  .filter(pres => 
                    pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pres.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((pres) => (
                    <TableRow key={pres.id} hover>
                      <TableCell>#{pres.id}</TableCell>
                      <TableCell>{pres.patientName}</TableCell>
                      <TableCell>
                        {format(new Date(pres.date), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{pres.diagnosis || '--'}</TableCell>
                      <TableCell>
                        {pres.medicines.length} loại
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={pres.status === 'pending' ? 'Chờ xử lý' : 'Đã hoàn thành'}
                          color={pres.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewPrescription(pres)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Chưa có đơn thuốc nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog tạo/xem đơn thuốc */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPrescription?.id ? 'Chi tiết đơn thuốc' : 'Tạo đơn thuốc mới'}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Thông tin bệnh nhân
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Họ tên bệnh nhân"
                size="small"
                fullWidth
                value={selectedPrescription?.patientName || ''}
                onChange={(e) => setSelectedPrescription({
                  ...selectedPrescription,
                  patientName: e.target.value
                })}
              />
              <TextField
                label="Tuổi"
                size="small"
                type="number"
                sx={{ width: '100px' }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  label="Giới tính"
                  defaultValue=""
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Chẩn đoán"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={selectedPrescription?.diagnosis || ''}
              onChange={(e) => setSelectedPrescription({
                ...selectedPrescription,
                diagnosis: e.target.value
              })}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Danh sách thuốc
            </Typography>
            
            <Box sx={{ mb: 2, p: 2, border: '1px dashed #ddd', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Tên thuốc"
                  size="small"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                />
                <TextField
                  label="Liều dùng"
                  size="small"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                />
                <TextField
                  label="Số lần/ngày"
                  size="small"
                  value={newMedicine.frequency}
                  onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                />
                <TextField
                  label="Số ngày dùng"
                  size="small"
                  value={newMedicine.duration}
                  onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                />
                <Button 
                  variant="contained" 
                  onClick={addMedicine}
                  disabled={!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency || !newMedicine.duration}
                >
                  Thêm
                </Button>
              </Box>
              
              {selectedPrescription?.medicines?.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thuốc</TableCell>
                        <TableCell>Liều dùng</TableCell>
                        <TableCell>Số lần/ngày</TableCell>
                        <TableCell>Số ngày</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPrescription.medicines.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.duration}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => removeMedicine(index)}
                              color="error"
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
            
            <TextField
              label="Ghi chú"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={selectedPrescription?.note || ''}
              onChange={(e) => setSelectedPrescription({
                ...selectedPrescription,
                note: e.target.value
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSavePrescription}
            disabled={!selectedPrescription?.patientName || !selectedPrescription?.diagnosis}
          >
            Lưu đơn thuốc
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrescriptionsPage;
