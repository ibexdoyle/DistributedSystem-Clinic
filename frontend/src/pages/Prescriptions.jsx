import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, FormControl, InputLabel, Select,
  Grid, Card, CardContent, Divider, Tooltip, LinearProgress, Badge, Alert
} from '@mui/material';
import {
  Search, LocalPharmacy, CheckCircle, Pending, Cancel, Refresh,
  Visibility, Print, Inventory, LocalHospital, Person, Medication, Warning
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Sample data - replace with API calls
const samplePrescriptions = [
  {
    id: 'RX-001',
    patientName: 'Nguyễn Văn A',
    patientId: 'BN001',
    doctorName: 'BS. Trần Thị B',
    date: '2025-06-04T09:30:00',
    status: 'pending',
    diagnosis: 'Viêm họng cấp',
    note: 'Uống thuốc đúng giờ, tái khám sau 1 tuần',
    medicines: [
      { id: 'M001', name: 'Paracetamol 500mg', stock: 150, required: 15, unit: 'viên' },
      { id: 'M002', name: 'Amoxicillin 500mg', stock: 80, required: 14, unit: 'viên' }
    ]
  },
  {
    id: 'RX-002',
    patientName: 'Trần Thị C',
    patientId: 'BN002',
    doctorName: 'BS. Lê Văn D',
    date: '2025-06-04T11:15:00',
    status: 'completed',
    diagnosis: 'Đau dạ dày',
    note: 'Kiêng đồ chua, cay, nóng',
    medicines: [
      { id: 'M003', name: 'Omeprazole 20mg', stock: 200, required: 14, unit: 'viên' },
      { id: 'M004', name: 'Domperidone 10mg', stock: 120, required: 21, unit: 'viên' }
    ]
  },
  {
    id: 'RX-003',
    patientName: 'Lê Văn E',
    patientId: 'BN003',
    doctorName: 'BS. Phạm Thị F',
    date: '2025-06-03T14:45:00',
    status: 'cancelled',
    diagnosis: 'Cảm cúm',
    note: 'Đã hủy do bệnh nhân không đến nhận thuốc',
    medicines: [
      { id: 'M005', name: 'Tiffy', stock: 50, required: 9, unit: 'viên' },
      { id: 'M006', name: 'Vitamin C 500mg', stock: 100, required: 5, unit: 'viên' }
    ]
  }
];

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Load sample data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrescriptions(samplePrescriptions);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update prescription status
  const updatePrescriptionStatus = (id, newStatus) => {
    setPrescriptions(prescriptions.map(prescription =>
      prescription.id === id ? { ...prescription, status: newStatus } : prescription
    ));
  };

  // View prescription details
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  // Get status chip
  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: 'warning' },
      completed: { label: 'Đã hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'error' }
    };
    
    return (
      <Chip 
        label={statusConfig[status]?.label || status}
        color={statusConfig[status]?.color || 'default'}
        size="small"
      />
    );
  };

  // Check medicine stock status
  const getStockStatus = (medicine) => {
    if (medicine.stock >= medicine.required) return 'success';
    if (medicine.stock > 0) return 'warning';
    return 'error';
  };

  // Format date
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            <LocalPharmacy sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quản lý Đơn thuốc
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Theo dõi và quản lý tất cả đơn thuốc trong hệ thống
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Làm mới
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm theo mã đơn, tên bệnh nhân, bác sĩ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Xóa bộ lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>


      {/* Prescriptions Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Ngày kê đơn</TableCell>
                <TableCell>Chuẩn đoán</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Đang tải dữ liệu...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <TableRow hover key={prescription.id}>
                    <TableCell>{prescription.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Person sx={{ color: 'text.secondary', mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2">{prescription.patientName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {prescription.patientId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocalHospital sx={{ color: 'primary.main', mr: 1 }} />
                        {prescription.doctorName}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(prescription.date)}</TableCell>
                    <TableCell>
                      <Tooltip title={prescription.diagnosis}>
                        <Typography noWrap sx={{ maxWidth: '200px' }}>
                          {prescription.diagnosis}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {prescription.medicines.map((medicine) => (
                          <Box key={medicine.id} mb={1}>
                            <Typography variant="body2">
                              {medicine.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box width="100px">
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(100, (medicine.stock / medicine.required) * 100)}
                                  color={getStockStatus(medicine)}
                                  sx={{ height: 8, borderRadius: 2 }}
                                />
                              </Box>
                              <Typography variant="caption" color="textSecondary">
                                {medicine.stock}/{medicine.required} {medicine.unit}
                              </Typography>
                              {medicine.stock < medicine.required && (
                                <Tooltip title="Cảnh báo: Không đủ thuốc trong kho">
                                  <Warning color="warning" fontSize="small" />
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(prescription.status)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewPrescription(prescription)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="In đơn thuốc">
                        <IconButton color="secondary">
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không tìm thấy đơn thuốc nào</Typography>
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
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPrescription && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Chi tiết đơn thuốc</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedPrescription.id}
                  </Typography>
                </Box>
                <Box>
                  {selectedPrescription.status === 'pending' && <Pending color="warning" />}
                  {selectedPrescription.status === 'completed' && <CheckCircle color="success" />}
                  {selectedPrescription.status === 'cancelled' && <Cancel color="error" />}
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Thông tin bệnh nhân
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ '& > *': { mb: 1 } }}>
                        <Typography><strong>Họ tên:</strong> {selectedPrescription.patientName}</Typography>
                        <Typography><strong>Mã BN:</strong> {selectedPrescription.patientId}</Typography>
                        <Typography><strong>Bác sĩ kê đơn:</strong> {selectedPrescription.doctorName}</Typography>
                        <Typography><strong>Ngày kê đơn:</strong> {formatDate(selectedPrescription.date)}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Thông tin khám bệnh
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ '& > *': { mb: 1 } }}>
                        <Typography><strong>Chuẩn đoán:</strong> {selectedPrescription.diagnosis}</Typography>
                        <Typography><strong>Ghi chú:</strong> {selectedPrescription.note || 'Không có ghi chú'}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Danh sách thuốc
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tên thuốc</TableCell>
                            <TableCell align="right">Tồn kho</TableCell>
                            <TableCell align="right">Yêu cầu</TableCell>
                            <TableCell align="right">Trạng thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedPrescription.medicines.map((medicine) => (
                            <TableRow key={medicine.id}>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell align="right">{medicine.stock} {medicine.unit}</TableCell>
                              <TableCell align="right">{medicine.required} {medicine.unit}</TableCell>
                              <TableCell align="right">
                                {medicine.stock >= medicine.required ? (
                                  <Chip label="Đủ" color="success" size="small" />
                                ) : medicine.stock > 0 ? (
                                  <Chip label="Thiếu" color="warning" size="small" />
                                ) : (
                                  <Chip label="Hết hàng" color="error" size="small" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Print />}
                onClick={() => window.print()}
              >
                In đơn thuốc
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Prescriptions;
