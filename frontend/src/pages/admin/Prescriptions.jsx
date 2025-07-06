import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  TextareaAutosize,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import { 
  Search, 
  Visibility,
  LocalPharmacy,
  Print as PrintIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  PendingOutlined as PendingOutlinedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const AdminPrescriptionsPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Mock data - in a real app, this would come from an API
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      date: '2025-06-10T10:30:00',
      status: 'pending',
      diagnosis: 'Viêm họng cấp',
      note: 'Uống thuốc đúng giờ, tái khám sau 1 tuần nếu không đỡ',
      doctorName: 'BS. Trần Văn B',
      medicines: [
        { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: '2 lần/ngày', duration: '5 ngày' },
        { id: 2, name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '7 ngày' }
      ]
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Trần Thị B',
      email: 'tranthib@example.com',
      date: '2025-06-09T14:15:00',
      status: 'completed',
      diagnosis: 'Cảm cúm',
      note: 'Nghỉ ngơi nhiều, uống đủ nước',
      doctorName: 'BS. Lê Thị C',
      medicines: [
        { id: 3, name: 'Tiffy', dosage: '1 viên', frequency: '3 lần/ngày', duration: '3 ngày' }
      ]
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Chưa lấy', color: 'warning', icon: <PendingOutlinedIcon /> },
    { value: 'completed', label: 'Đã lấy', color: 'success', icon: <CheckCircleOutlineIcon /> }
  ];

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(pres => {
    const matchesSearch = 
      pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pres.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pres.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pres.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusUpdate = async (prescriptionId, newStatus) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPrescriptions(prescriptions.map(pres => 
        pres.id === prescriptionId 
          ? { ...pres, status: newStatus }
          : pres
      ));
      
      enqueueSnackbar(`Đã cập nhật trạng thái đơn thuốc thành "${newStatus === 'completed' ? 'Đã lấy' : 'Chưa lấy'}"`, { variant: 'success' });
    } catch (error) {
      console.error('Error updating prescription status:', error);
      enqueueSnackbar('Có lỗi xảy ra khi cập nhật trạng thái', { variant: 'error' });
    }
  };

  // Handle view prescription details
  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrescription(null);
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return statusObj || { label: 'Không xác định', color: 'default' };
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          <LocalPharmacy sx={{ verticalAlign: 'middle', mr: 1 }} />
          Quản lý đơn thuốc
        </Typography>
      </Box>

      {/* Filter and search */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm theo tên bệnh nhân, chẩn đoán hoặc bác sĩ..."
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
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      {status.icon}
                      <Box component="span" sx={{ ml: 1 }}>{status.label}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Prescriptions table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Bác sĩ kê đơn</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((pres) => {
                  const status = getStatusDisplay(pres.status);
                  return (
                    <TableRow key={pres.id} hover>
                      <TableCell>#{pres.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                            {pres.patientName.charAt(0)}
                          </Avatar>
                          {pres.patientName}
                        </Box>
                      </TableCell>
                      <TableCell>{pres.doctorName}</TableCell>
                      <TableCell>
                        {format(new Date(pres.date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell>{pres.diagnosis || '--'}</TableCell>
                      <TableCell>{pres.medicines.length} loại</TableCell>
                      <TableCell>
                        <Chip 
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1} alignItems="center">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(pres)}
                            title="Xem chi tiết"
                            sx={{ mr: 1 }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          
                          {/* Chỉ hiển thị nút "Đã lấy" nếu trạng thái là "Chưa lấy" */}
                          {pres.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<CheckCircleOutlineIcon />}
                              onClick={(e) => {
                                // Vô hiệu hóa nút ngay lập tức khi nhấn
                                e.currentTarget.disabled = true;
                                e.currentTarget.style.opacity = '0.7';
                                handleStatusUpdate(pres.id, 'completed');
                              }}
                              sx={{
                                minWidth: 100,
                                '&.Mui-disabled': {
                                  opacity: 0.7,
                                  color: 'success.main',
                                  borderColor: 'success.main'
                                }
                              }}
                            >
                              Đã lấy
                            </Button>
                          )}
                          
                          {/* Hiển thị trạng thái nếu đã lấy */}
                          {pres.status === 'completed' && (
                            <Chip 
                              icon={<CheckCircleOutlineIcon />}
                              label="Đã lấy"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy đơn thuốc nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Prescription Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết đơn thuốc #{selectedPrescription?.id}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPrescription && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Thông tin bệnh nhân
                  </Typography>
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <Typography><strong>Họ tên:</strong> {selectedPrescription.patientName}</Typography>
                    <Typography><strong>Mã BN:</strong> {selectedPrescription.patientId}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Thông tin bác sĩ
                  </Typography>
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <Typography><strong>Bác sĩ:</strong> {selectedPrescription.doctorName}</Typography>
                    <Typography><strong>Ngày kê đơn:</strong> {format(new Date(selectedPrescription.date), 'dd/MM/yyyy HH:mm', { locale: vi })}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>
                Chẩn đoán
              </Typography>
              <Box sx={{ pl: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography>{selectedPrescription.diagnosis}</Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Đơn thuốc
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên thuốc</TableCell>
                      <TableCell>Liều dùng</TableCell>
                      <TableCell>Số lần/ngày</TableCell>
                      <TableCell>Số ngày</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPrescription.medicines.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{med.duration}</TableCell>
                        <TableCell>{med.note || '--'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedPrescription.note && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Ghi chú
                  </Typography>
                  <Box sx={{ pl: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, whiteSpace: 'pre-line' }}>
                    {selectedPrescription.note}
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Đóng
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            In đơn thuốc
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPrescriptionsPage;
