import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, IconButton, Menu, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, TablePagination, Chip,
  Avatar, CircularProgress, Snackbar, Alert, Dialog, DialogTitle
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

import PatientForm from '../../components/patient/PatientForm';
import PatientDetails from '../../components/patient/PatientDetails';

const PATIENT_API_BASE = "http://localhost:8082/api/patients";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    default: return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Đang điều trị';
    case 'inactive': return 'Ngừng điều trị';
    default: return 'Không xác định';
  }
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(PATIENT_API_BASE, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'admin@example.com'
        }
      });

      if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
      const data = await response.json();

      const mapped = data.map((p, index) => ({
        id: p.id,
        patientId: `BN${(p.id || index + 1).toString().padStart(4, '0')}`,
        name: p.fullName,
        gender: p.gender,
        age: p.dob ? calculateAge(p.dob) : '-',
        phone: p.phoneNumber,
        email: p.email,
        address: p.address,
        dob: p.dob,
        status: 'active'
      }));

      setPatients(mapped);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bệnh nhân:', error);
      showSnackbar('Không thể tải danh sách bệnh nhân', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    try {
      const response = await fetch(`${PATIENT_API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Lỗi khi xóa bệnh nhân");

      setPatients(prev => prev.filter(p => p.id !== id));
      showSnackbar('Xóa bệnh nhân thành công');
    } catch (err) {
      console.error(err);
      showSnackbar('Xóa thất bại', 'error');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
    handleMenuClose();
  };

  const handleOpenForm = () => {
    setOpenForm(true);
    handleMenuClose();
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedPatient(null);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedPatient(null);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
    handleMenuClose();
  };

  const handleDeleteConfirmed = async () => {
    if (selectedPatient) {
      await deletePatient(selectedPatient.id);
      setConfirmDelete(false);
      setSelectedPatient(null);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPatients = patients.filter(p => {
    const s = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.phone.toLowerCase().includes(s) ||
      p.email.toLowerCase().includes(s) ||
      p.patientId.toLowerCase().includes(s)
    );
  });

  const paginatedPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Danh sách bệnh nhân</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpenForm(true)}>
          Thêm bệnh nhân
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm theo tên, số điện thoại, email hoặc mã BN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon /></InputAdornment>
            )
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã BN</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Tuổi</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>
            ) : paginatedPatients.length === 0 ? (
              <TableRow><TableCell colSpan={9} align="center">Không có bệnh nhân nào</TableCell></TableRow>
            ) : (
              paginatedPatients.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.patientId}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 1 }}>{p.name.charAt(0)}</Avatar>
                      {p.name}
                    </Box>
                  </TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(p.status)}
                      color={getStatusColor(p.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, p)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredPatients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
      />

      {/* Menu actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleOpenForm}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleConfirmDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" /> Xóa
        </MenuItem>
      </Menu>

      {/* Patient detail dialog */}
      {selectedPatient && (
        <PatientDetails
          open={openDetails}
          onClose={handleCloseDetails}
          patient={selectedPatient}
        />
      )}

      {/* Patient form dialog */}
      {openForm && (
        <PatientForm
          open={openForm}
          onClose={handleCloseForm}
          patient={selectedPatient}
          onSaved={() => {
            fetchPatients();
            handleCloseForm();
          }}
        />
      )}

      {/* Confirm delete dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Bạn có chắc chắn muốn xóa bệnh nhân này?</DialogTitle>
        <Box p={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={() => setConfirmDelete(false)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirmed}>
            Xóa
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Patients;
