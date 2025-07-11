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
  );
};

export default AppointmentsPage;
