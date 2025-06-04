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
import { format, parseISO, startOfDay, endOfDay, isSameDay } from 'date-fns';
import vi from 'date-fns/locale/vi';
import CalendarView from '../../components/appointment/CalendarView';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AppointmentActions from '../../components/appointment/AppointmentActions';

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
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateAppointments, setShowDateAppointments] = useState(true);

  // Làm mới dữ liệu
  const handleRefresh = () => {
    setIsLoading(true);
    // Giả lập việc tải lại dữ liệu
    setTimeout(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setAppointments([...sampleAppointments]);
      setFilterStatus('all');
      setSearchTerm('');
      setFilterDate(today);
      setSelectedDate(today);
      setShowDateAppointments(true);
      setPage(0);
      setIsLoading(false);
    }, 300);
  };

  // Khởi tạo dữ liệu mẫu
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setFilterStatus('all');
    setSearchTerm('');
    setFilterDate(today);
    setSelectedDate(today);
    setShowDateAppointments(true);
    
    // Set the document title
    document.title = `Lịch hẹn ngày ${format(today, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
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
  const filteredAppointments = React.useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    
    return appointments.filter(appointment => {
      if (!appointment || !appointment.date) return false;
      
      try {
        const appointmentDate = new Date(appointment.date);
        if (isNaN(appointmentDate.getTime())) return false;
        
        // Lọc theo ngày được chọn
        if (selectedDate) {
          try {
            const selected = new Date(selectedDate);
            selected.setHours(0, 0, 0, 0);
            appointmentDate.setHours(0, 0, 0, 0);
            
            if (appointmentDate.getTime() !== selected.getTime()) {
              return false;
            }
          } catch (error) {
            console.error('Lỗi khi lọc ngày:', error);
            return false;
          }
        }
        // Nếu có bộ lọc ngày
        else if (filterDate) {
          try {
            const filter = new Date(filterDate);
            filter.setHours(0, 0, 0, 0);
            appointmentDate.setHours(0, 0, 0, 0);
            
            if (appointmentDate.getTime() !== filter.getTime()) {
              return false;
            }
          } catch (error) {
            console.error('Lỗi khi lọc ngày:', error);
            return false;
          }
        }
        
        const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
          (appointment.patientName && appointment.patientName.toLowerCase().includes(searchLower)) ||
          (appointment.phone && appointment.phone.includes(searchTerm)) ||
          (appointment.doctor && appointment.doctor.toLowerCase().includes(searchLower));
        
        return matchesStatus && matchesSearch;
      } catch (error) {
        console.error('Lỗi khi xử lý dữ liệu lịch hẹn:', error);
        return false;
      }
    });
  }, [appointments, selectedDate, filterDate, filterStatus, searchTerm]);

  // Xử lý chọn ngày
  const handleDateSelect = (date) => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      setSelectedDate(selectedDate);
      setFilterDate(selectedDate);
      
      // Update the document title
      document.title = `Lịch hẹn ngày ${format(selectedDate, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
    }
  };

  // Chuyển đến ngày hôm trước
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    prevDay.setHours(0, 0, 0, 0);
    setSelectedDate(prevDay);
    setFilterDate(prevDay);
    
    // Update the document title
    document.title = `Lịch hẹn ngày ${format(prevDay, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
  };

  // Chuyển đến ngày hôm sau
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    setSelectedDate(nextDay);
    setFilterDate(nextDay);
    
    // Update the document title
    document.title = `Lịch hẹn ngày ${format(nextDay, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
  };

  // Chuyển về hôm nay
  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    setFilterDate(today);
    
    // Update the document title
    document.title = `Lịch hẹn ngày ${format(today, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
  };

  // Quay lại xem lịch
  const handleBackToCalendar = () => {
    setShowDateAppointments(false);
    setSelectedDate(null);
    setFilterDate(null);
  };

  // Làm mới bộ lọc
  const handleResetFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setFilterDate(today);
    setFilterStatus('all');
    setSearchTerm('');
    setShowDateAppointments(true);
    setSelectedDate(today);
    
    // Update the document title
    document.title = `Lịch hẹn ngày ${format(today, 'dd/MM/yyyy')} | Hệ thống quản lý phòng khám`;
  };

  // Cập nhật trạng thái lịch hẹn
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
    setIsActionsOpen(false);
  };

  // Cập nhật thông tin lịch hẹn
  const handleEditAppointment = (id, updatedData) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { 
        ...appt, 
        ...updatedData,
        date: updatedData.date.toISOString() 
      } : appt
    ));
    setIsActionsOpen(false);
  };

  // Mở hộp thoại chi tiết lịch hẹn
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsActionsOpen(true);
  };

  // Đóng hộp thoại chi tiết lịch hẹn
  const handleCloseActions = () => {
    setIsActionsOpen(false);
    setSelectedAppointment(null);
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString) => {
    return format(parseISO(dateTimeString), 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  // Thống kê
  const stats = [
    { 
      title: 'Tổng số lịch hẹn', 
      value: appointments.length,
      color: 'primary.main',
      icon: '📅'
    },
    { 
      title: 'Đã xác nhận', 
      value: appointments.filter(a => a.status === 'confirmed').length,
      color: 'success.main',
      icon: '✅'
    },
    { 
      title: 'Chờ xác nhận', 
      value: appointments.filter(a => a.status === 'pending').length,
      color: 'warning.main',
      icon: '⏳'
    },
    { 
      title: 'Đã hủy', 
      value: appointments.filter(a => a.status === 'cancelled').length,
      color: 'error.main',
      icon: '❌'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Lịch hẹn ngày {format(selectedDate, 'dd/MM/yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleToday}
            size="small"
          >
            Hôm nay
          </Button>
          <IconButton 
            onClick={handlePreviousDay}
            size="small"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton 
            onClick={handleNextDay}
            size="small"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                borderLeft: `4px solid ${stat.color}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}
              >
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  Không tìm thấy lịch hẹn nào
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow 
                    key={appointment.id}
                    hover
                    onClick={() => handleAppointmentClick(appointment)}
                    sx={{ cursor: 'pointer' }}
                  >
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
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentClick(appointment);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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

      {/* Hộp thoại chi tiết lịch hẹn */}
      {selectedAppointment && (
        <AppointmentActions
          open={isActionsOpen}
          onClose={handleCloseActions}
          appointment={selectedAppointment}
          onStatusChange={updateAppointmentStatus}
          onEdit={handleEditAppointment}
        />
      )}
    </Box>
  );
};

export default Appointments;
