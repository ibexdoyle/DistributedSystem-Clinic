import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, InputAdornment, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, FormControl,
  InputLabel, Select, Grid, Avatar
} from '@mui/material';
import {
  Search, Visibility, LocalPharmacy, Print as PrintIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  PendingOutlined as PendingOutlinedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const AdminPrescriptionsPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [prescriptions, setPrescriptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'pending', label: 'Chưa lấy', color: 'warning', icon: <PendingOutlinedIcon /> },
    { value: 'completed', label: 'Đã lấy', color: 'success', icon: <CheckCircleOutlineIcon /> }
  ];

  // Fetch prescriptions from backend
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch('http://localhost:8085/api/prescriptions');
        if (!res.ok) throw new Error('Prescription API error');
        const data = await res.json();

        const patientIds = [...new Set(data.map(p => p.patientId))];
        const patientMap = {};

        const patientFetches = await Promise.all(
          patientIds.map(id =>
            fetch(`http://localhost:8082/api/patients/${id}`)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        );

        patientIds.forEach((id, index) => {
          const info = patientFetches[index];
          patientMap[id] = info?.fullName || `BN${id}`;
        });

        const mapped = data.map(p => ({
          id: p.id,
          patientId: p.patientId,
          patientName: patientMap[p.patientId],
          date: p.createdAt,
          status: 'pending', // default, update if your backend supports it
          diagnosis: p.diagnosis,
          note: p.note,
          doctorName: p.doctorName,
          medicines: p.items.map(i => ({
            name: i.medicineName,
            dosage: i.dosage,
            note: i.note || ''
          }))
        }));

        setPrescriptions(mapped);
      } catch (error) {
        console.error('Fetch error:', error);
        enqueueSnackbar('Lỗi khi tải dữ liệu đơn thuốc', { variant: 'error' });
      }
    };

    fetchPrescriptions();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Fake API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setPrescriptions(prev =>
        prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
      );
      enqueueSnackbar('Cập nhật trạng thái thành công', { variant: 'success' });
    } catch {
      enqueueSnackbar('Lỗi khi cập nhật trạng thái', { variant: 'error' });
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrescription(null);
  };

  const getStatusDisplay = (status) => {
    return statusOptions.find(opt => opt.value === status) || {
      label: 'Không xác định',
      color: 'default'
    };
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const keyword = searchTerm.toLowerCase();
    const matchesSearch =
      p.patientName.toLowerCase().includes(keyword) ||
      p.diagnosis?.toLowerCase().includes(keyword) ||
      p.doctorName.toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">
          <LocalPharmacy sx={{ verticalAlign: 'middle', mr: 1 }} />
          Quản lý đơn thuốc
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
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
                    <Box display="flex" alignItems="center">
                      {status.icon}
                      <Box ml={1}>{status.label}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Ngày kê</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map(p => {
                  const status = getStatusDisplay(p.status);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>#{p.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 1 }}>{p.patientName?.charAt(0)}</Avatar>
                          {p.patientName}
                        </Box>
                      </TableCell>
                      <TableCell>{p.doctorName}</TableCell>
                      <TableCell>{format(new Date(p.date), 'dd/MM/yyyy HH:mm', { locale: vi })}</TableCell>
                      <TableCell>{p.diagnosis}</TableCell>
                      <TableCell>{p.medicines.length} loại</TableCell>
                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(p)}>
                            <Visibility />
                          </IconButton>
                          {p.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<CheckCircleOutlineIcon />}
                              onClick={() => handleStatusUpdate(p.id, 'completed')}
                            >
                              Đã lấy
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có đơn thuốc nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết đơn thuốc #{selectedPrescription?.id}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPrescription && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Thông tin bệnh nhân</Typography>
                  <Box pl={2}>
                    <Typography><strong>Họ tên:</strong> {selectedPrescription.patientName}</Typography>
                    <Typography><strong>Mã BN:</strong> {selectedPrescription.patientId}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Thông tin bác sĩ</Typography>
                  <Box pl={2}>
                    <Typography><strong>Bác sĩ:</strong> {selectedPrescription.doctorName}</Typography>
                    <Typography><strong>Ngày kê:</strong> {format(new Date(selectedPrescription.date), 'dd/MM/yyyy HH:mm', { locale: vi })}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography mt={3} variant="subtitle2">Chẩn đoán</Typography>
              <Box bgcolor="grey.100" p={2} borderRadius={1} mb={2}>
                {selectedPrescription.diagnosis}
              </Box>

              <Typography variant="subtitle2">Đơn thuốc</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
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
                        <TableCell>{med.note || '--'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedPrescription.note && (
                <>
                  <Typography mt={3} variant="subtitle2">Ghi chú</Typography>
                  <Box bgcolor="grey.100" p={2} borderRadius={1}>{selectedPrescription.note}</Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button
            variant="contained"
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
