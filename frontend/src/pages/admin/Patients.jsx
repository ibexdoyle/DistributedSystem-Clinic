import React, { useState } from 'react';
import {
  Box,
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
  Button,
  Typography,
  Avatar,
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  FilterList as FilterListIcon,
  LocalHospital as LocalHospitalIcon,
  EventNote as EventNoteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Dummy data - Thay thế bằng dữ liệu thực tế từ API
const createPatientData = (id, name, gender, age, phone, email, address, lastVisit, status) => ({
  id, name, gender, age, phone, email, address, lastVisit, status
});

const patients = [
  createPatientData(1, 'Nguyễn Văn A', 'Nam', 35, '0987654321', 'nguyenvana@example.com', '123 Đường ABC, Quận 1, TP.HCM', '2023-05-20', 'active'),
  createPatientData(2, 'Trần Thị B', 'Nữ', 28, '0912345678', 'tranthib@example.com', '456 Đường XYZ, Quận 3, TP.HCM', '2023-05-22', 'active'),
  createPatientData(3, 'Lê Văn C', 'Nam', 45, '0905123456', 'levanc@example.com', '789 Đường DEF, Quận 5, TP.HCM', '2023-05-18', 'inactive'),
  createPatientData(4, 'Phạm Thị D', 'Nữ', 32, '0978123456', 'phamthid@example.com', '321 Đường GHI, Quận 10, TP.HCM', '2023-05-15', 'active'),
  createPatientData(5, 'Hoàng Văn E', 'Nam', 50, '0918765432', 'hoangvane@example.com', '654 Đường KLM, Quận Tân Bình, TP.HCM', '2023-05-10', 'inactive'),
];

const statusMap = {
  'Tất cả': '',
  'Đang điều trị': 'active',
  'Đã khỏi bệnh': 'inactive',
  'Chờ xác nhận': 'pending'
};

const statuses = Object.keys(statusMap);

const Patients = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [anchorFilterEl, setAnchorFilterEl] = useState(null);

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

  const handleMenuOpen = (event, patientId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientId(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatientId(null);
  };

  const handleFilterClick = (event) => {
    setAnchorFilterEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorFilterEl(null);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setPage(0);
    handleFilterClose();
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       patient.phone.includes(searchTerm) ||
                       (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusValue = statusMap[selectedStatus];
    const matchesStatus = selectedStatus === 'Tất cả' || patient.status === statusValue;
    return matchesSearch && matchesStatus;
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPatients.length) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang điều trị';
      case 'inactive':
        return 'Đã khỏi bệnh';
      default:
        return 'Chờ xác nhận';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Quản lý bệnh nhân</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PersonAddIcon />}
          onClick={() => {}}
        >
          Thêm bệnh nhân
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm bệnh nhân..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 250 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ ml: 'auto' }}
          >
            {selectedStatus}
          </Button>
          
          <Menu
            anchorEl={anchorFilterEl}
            open={Boolean(anchorFilterEl)}
            onClose={handleFilterClose}
          >
            {statuses.map((status) => (
              <MenuItem 
                key={status} 
                onClick={() => handleStatusSelect(status)}
                selected={status === selectedStatus}
              >
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Paper>

      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: '70vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thông tin bệnh nhân</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Lần khám gần nhất</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredPatients
            ).map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {patient.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {patient.name}
                        <Chip 
                          label={patient.gender === 'Nam' ? 'Nam' : 'Nữ'} 
                          size="small" 
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                          variant="outlined"
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {patient.id} | {patient.age} tuổi
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{patient.phone}</Typography>
                    </Box>
                    {patient.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {patient.email}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(patient.lastVisit).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(patient.status)}
                    size="small"
                    color={getStatusColor(patient.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Xem hồ sơ">
                      <IconButton size="small" color="primary">
                        <LocalHospitalIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Đặt lịch hẹn">
                      <IconButton size="small" color="secondary">
                        <EventNoteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, patient.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
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
            `${from}-${to} trong ${count}`
          }
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EventNoteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem lịch sử khám</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Xóa hồ sơ</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Patients;
