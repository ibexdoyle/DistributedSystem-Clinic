<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  TextField, InputAdornment, IconButton, Tabs, Tab, Chip,
  Menu, MenuItem, ListItemIcon, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
  Search, Refresh, Today, EventAvailable,
  EventBusy, MedicalServices, MoreVert,
  PersonOff, CheckCircle, Cancel, HourglassEmpty
} from '@mui/icons-material';
import { formatISO, parseISO, isToday, isAfter, differenceInMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';

const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang khám',
  COMPLETED: 'Đã hoàn thành',
  CANCELLED: 'Đã hủy',
  NO_SHOW: 'Vắng mặt'
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const doctorId = user?.staffId;
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const fetchAppointments = useCallback(() => {
    if (!doctorId) return;
    fetch(`/api/appointments/doctor/${doctorId}`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data.map(item => ({
          id: item.id,
          patientName: item.patientName || '',
          phone: item.phone || '',
          service: item.reason || '',
          time: item.appointmentDateTime,
          status: item.status
        })));
      })
      .catch(console.error);
  }, [doctorId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatusOnServer = (id, newStatus) => {
    fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatus)
    })
      .then(res => res.json())
      .then(fetchAppointments)
      .catch(console.error);
  };

  const handleStatusChange = (id, newStatus) => {
    const action = () => updateStatusOnServer(id, newStatus);
    if ([APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW].includes(newStatus)) {
      setPendingAction(() => action);
      setOpenConfirmDialog(true);
    } else {
      action();
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.time);
    const isUpcoming = isAfter(apptDate, new Date());
    const isSelectedDate = selectedDate ? apptDate.toDateString() === selectedDate.toDateString() : true;
    const matchesTab =
      (tabValue === 0 && isToday(apptDate)) ||
      (tabValue === 1 && isUpcoming) ||
      (tabValue === 2);

    return isSelectedDate && matchesTab && appt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth={false} sx={{ mt: 3, mb: 4, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">
            <MedicalServices sx={{ mr: 1 }} /> Lịch khám của bác sĩ
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newVal) => setSelectedDate(newVal)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <TextField
              size="small"
              placeholder="Tìm kiếm bệnh nhân"
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
            <IconButton onClick={fetchAppointments}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
          <Tab label="Hôm nay" icon={<Today />} iconPosition="start" />
          <Tab label="Sắp tới" icon={<EventAvailable />} iconPosition="start" />
          <Tab label="Tất cả" icon={<EventBusy />} iconPosition="start" />
        </Tabs>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Dịch vụ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appt, index) => (
                  <TableRow key={appt.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{appt.patientName}</TableCell>
                    <TableCell>{formatISO(parseISO(appt.time), { representation: 'date' })}</TableCell>
                    <TableCell>{appt.service}</TableCell>
                    <TableCell>
                      <Chip label={STATUS_LABELS[appt.status]} />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleStatusChange(appt.id, APPOINTMENT_STATUS.CONFIRMED)}>Xác nhận</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogContent>
            <DialogContentText>Bạn chắc chắn thực hiện hành động này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
            <Button onClick={() => { pendingAction(); setOpenConfirmDialog(false); }} autoFocus>Xác nhận</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
=======
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, TextField, MenuItem
} from '@mui/material';
import { MedicalServices } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

const STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Đã xác nhận',
  [APPOINTMENT_STATUS.CANCELLED]: 'Đã hủy',
  [APPOINTMENT_STATUS.COMPLETED]: 'Đã hoàn thành'
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'SCHEDULED':
      return { bgColor: '#fff8e1', textColor: '#ed6c02', borderColor: '#ffcc80' };
    case 'COMPLETED':
      return { bgColor: '#e8f5e9', textColor: '#2e7d32', borderColor: '#a5d6a7' };
    case 'CANCELLED':
      return { bgColor: '#ffebee', textColor: '#d32f2f', borderColor: '#ef9a9a' };
    default:
      return { bgColor: '#f5f5f5', textColor: '#757575', borderColor: '#e0e0e0' };
  }
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) throw new Error('Không tìm thấy token');

        const decoded = jwtDecode(token);
        const email = decoded?.sub;
        if (!email) throw new Error('Không tìm thấy email');

        const staffRes = await fetch('http://localhost:8083/api/staffs');
        if (!staffRes.ok) throw new Error('Lỗi khi fetch staff');

        const staffList = await staffRes.json();
        const doctor = staffList.find(s => s.email === email && (s.staffRole === 'DOCTOR' || s.staff_role === 'DOCTOR'));
        if (!doctor) throw new Error('Không tìm thấy bác sĩ');

        const apptRes = await fetch(`http://localhost:8084/api/appointments/doctor/${doctor.id}`);
        if (!apptRes.ok) throw new Error('Lỗi khi fetch lịch hẹn');

        const rawAppointments = await apptRes.json();
        const mapped = rawAppointments.map((appt, index) => ({
          ...appt,
          stt: index + 1,
          time: appt.appointmentDateTime,
          patientName: appt.patientName || 'Bệnh nhân',
          patientCode: appt.patientId || '-',
          phone: appt.patientPhone || '',
          status: appt.status,
          service: appt.reason || 'Chưa nhập'
        }));

        setAppointments(mapped);
      } catch (err) {
        console.error('Lỗi:', err);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = format(parseISO(appt.time), 'yyyy-MM-dd');
    const selectedDateStr = selectedDate ? selectedDate.format('YYYY-MM-DD') : '';
    const matchDate = !selectedDateStr || apptDate === selectedDateStr;
    const matchStatus = !selectedStatus || appt.status === selectedStatus;
    return matchDate && matchStatus;
  });

  return (
    <Container maxWidth={false} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        <MedicalServices sx={{ mr: 1 }} />Lịch hẹn của tôi
      </Typography>

      <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <DatePicker
            label="Lọc theo ngày"
            format="DD/MM/YYYY"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: { variant: 'outlined' }
            }}
          />
        </LocalizationProvider>

        <TextField
          select
          label="Lọc theo trạng thái"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          onClick={() => {
            setSelectedDate(dayjs());
            setSelectedStatus('');
          }}
        >
          Xóa lọc
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã bệnh nhân</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.stt}</TableCell>
                    <TableCell>{appt.patientCode}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{appt.patientName}</Typography>
                      <Typography variant="body2" color="textSecondary">{appt.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(appt.time), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[appt.status] || appt.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusStyles(appt.status).bgColor,
                          color: getStatusStyles(appt.status).textColor,
                          border: '1px solid',
                          borderColor: getStatusStyles(appt.status).borderColor,
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    Không có lịch hẹn nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
>>>>>>> 2fe6c4d (Updated doctor)
  );
};

export default AppointmentsPage;
