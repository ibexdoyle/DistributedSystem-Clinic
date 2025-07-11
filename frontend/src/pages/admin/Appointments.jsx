import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TextField, Button, IconButton,
  MenuItem, Select, InputLabel, FormControl, Grid, Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

const statusMap = {
  scheduled: { label: 'Đã lên lịch', color: 'info' },
  completed: { label: 'Hoàn thành', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'error' }
};

// 👉 Địa chỉ backend
const BACKEND_BASE_URL = "http://localhost:8084"; // đổi nếu khác IP hoặc port

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAppointments = async (date) => {
    try {
      setIsLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const url = `${BACKEND_BASE_URL}/api/appointments/date/${formattedDate}`;

      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Lỗi API: ${response.status} - ${text}`);
      }

      const data = await response.json();

      const mapped = data.map(item => ({
        id: item.id,
        patientName: item.patientName,
        doctor: item.doctorName,
        service: item.medicalSpecialty,
        note: item.reason,
        status: item.status.toLowerCase(),
        date: item.appointmentDateTime
      }));

      setAppointments(mapped);
    } catch (error) {
      console.error("❌ Lỗi khi lấy lịch hẹn:", error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const filteredAppointments = appointments.filter(appt => {
    const matchStatus = filterStatus === 'all' || appt.status === filterStatus;
    const search = searchTerm.toLowerCase();
    const matchSearch =
      appt.patientName?.toLowerCase().includes(search) ||
      appt.doctor?.toLowerCase().includes(search) ||
      appt.service?.toLowerCase().includes(search);
    return matchStatus && matchSearch;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDateTime = (str) => {
    try {
      return format(parseISO(str), 'HH:mm dd/MM/yyyy', { locale: vi });
    } catch {
      return str;
    }
  };

  const handlePreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSelectedDate(new Date());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Lịch hẹn ngày {format(selectedDate, 'dd/MM/yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleToday}>Hôm nay</Button>
          <IconButton onClick={handlePreviousDay}><ChevronLeft /></IconButton>
          <IconButton onClick={handleNextDay}><ChevronRight /></IconButton>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField fullWidth size="small" {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                label="Trạng thái"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth size="small"
              label="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ endAdornment: <SearchIcon /> }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              startIcon={<RefreshIcon />}
              variant="outlined"
              onClick={handleResetFilters}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Bệnh nhân</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} align="center">Đang tải...</TableCell></TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">Không có lịch hẹn</TableCell></TableRow>
            ) : (
              filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell>#{appt.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell>{appt.patientName}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>{appt.service}</TableCell>
                    <TableCell>{formatDateTime(appt.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[appt.status]?.label || appt.status}
                        color={statusMap[appt.status]?.color || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{appt.note || '-'}</TableCell>
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
        />
      </TableContainer>
    </Box>
  );
};

export default Appointments;
