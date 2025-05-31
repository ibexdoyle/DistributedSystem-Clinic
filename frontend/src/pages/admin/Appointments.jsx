import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

// Dữ liệu mẫu
const sampleAppointments = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    phone: '0912345678',
    doctor: 'BS. Trần Thị B',
    service: 'Khám tổng quát',
    date: '2025-06-01T09:00:00',
    status: 'pending',
    note: 'Tái khám định kỳ'
  },
  {
    id: 2,
    patientName: 'Trần Văn C',
    phone: '0987654321',
    doctor: 'BS. Lê Văn D',
    service: 'Điều trị nội khoa',
    date: '2025-06-01T10:30:00',
    status: 'in_progress',
    note: 'Đang điều trị bệnh dạ dày'
  },
  {
    id: 3,
    patientName: 'Phạm Thị E',
    phone: '0905123456',
    doctor: 'BS. Nguyễn Văn F',
    service: 'Vật lý trị liệu',
    date: '2025-06-02T14:00:00',
    status: 'in_progress',
    note: 'Vật lý trị liệu cột sống'
  },
  {
    id: 4,
    patientName: 'Lê Văn G',
    phone: '0912345678',
    doctor: 'BS. Trần Thị B',
    service: 'Khám tổng quát',
    date: '2025-06-03T11:15:00',
    status: 'completed',
    note: 'Khám sức khỏe định kỳ'
  }
];

const statusMap = {
  pending: { label: 'Chờ xác nhận', color: 'warning' },
  confirmed: { label: 'Đã xác nhận', color: 'info' },
  in_progress: { label: 'Đang điều trị', color: 'primary' },
  completed: { label: 'Đã hoàn thành', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'error' }
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load dữ liệu mẫu khi component mount
  useEffect(() => {
    // Giả lập việc tải dữ liệu từ API
    const timer = setTimeout(() => {
      setAppointments(sampleAppointments);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lọc lịch hẹn
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = !filterDate || 
      format(parseISO(appointment.date), 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    const matchesSearch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesStatus && matchesSearch;
  });

  // Làm mới bộ lọc
  const handleResetFilters = () => {
    setFilterDate(null);
    setFilterStatus('all');
    setSearchTerm('');
  };

  // Cập nhật trạng thái lịch hẹn
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString) => {
    return format(parseISO(dateTimeString), 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý Lịch hẹn
      </Typography>

      {/* Bộ lọc */}
      <Paper sx={{ p: 2, mb: 3, overflow: 'hidden' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Chọn ngày"
                value={filterDate}
                onChange={(newValue) => {
                  setFilterDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    size="small"
                    sx={{ '& .MuiInputBase-input': { py: '8.5px' } }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                value={filterStatus}
                label="Trạng thái"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ '& .MuiSelect-select': { py: '8.5px' } }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="in_progress">Đang điều trị</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={8} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Tìm kiếm theo tên, SĐT, bác sĩ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon sx={{ ml: 1 }} />,
                sx: { '& input': { py: '8.5px' } }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3} sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            mt: { xs: 1, sm: 0 }
          }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
              fullWidth
              sx={{ 
                whiteSpace: 'nowrap',
                py: '8px',
                maxWidth: { sm: '200px' }
              }}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bảng dữ liệu */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxWidth: '100%', 
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
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Mã lịch hẹn</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Bệnh nhân</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Số điện thoại</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Bác sĩ</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Dịch vụ</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Thời gian</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Ghi chú</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>#{appointment.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{appointment.patientName}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{appointment.phone}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{appointment.doctor}</TableCell>
                    <TableCell sx={{ minWidth: '120px' }}>{appointment.service}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(appointment.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[appointment.status]?.label || appointment.status}
                        color={statusMap[appointment.status]?.color || 'default'}
                        size="small"
                        sx={{ minWidth: '100px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                              title={appointment.note || ''}>
                      {appointment.note || '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              Hủy
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Hoàn thành
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  Không tìm thấy lịch hẹn nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} trong tổng số ${count}`
          }
        />
      </TableContainer>
    </Box>
  );
};

export default Appointments;
