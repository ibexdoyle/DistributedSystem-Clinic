import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Box, 
  Button, 
  Tabs, 
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  CalendarMonth as CalendarMonthIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  MonetizationOn as MonetizationOnIcon,
  Notes as NotesIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { format, parseISO, isBefore, isAfter, addDays } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import Stack from '@mui/material/Stack';
import { getAppointmentsByPatient, getAllAppointments, cancelAppointment } from '../mock/appointmentsDB';

// Hàm hỗ trợ cho accessibility của các tab
function a11yProps(index) {
  return {
    id: `appointment-tab-${index}`,
    'aria-controls': `appointment-tabpanel-${index}`,
  };
}

const statusColor = status => {
  switch (status) {
    case 'Đã đăng ký': return 'primary';
    case 'Đã khám': return 'success';
    case 'Đã hủy': return 'error';
    default: return 'default';
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, mt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyAppointments = () => {
  const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : '';
  const [appointments, setAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [reasonError, setReasonError] = useState('');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Giả lập việc tải dữ liệu
    const timer = setTimeout(() => {
      setAppointments(getAppointmentsByPatient(username));
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Phân loại lịch hẹn
  const upcomingAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate >= today && appt.status !== 'Đã hủy' && appt.status !== 'Đã khám';
  });

  const pastAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate < today || appt.status === 'Đã khám' || appt.status === 'Đã hủy';
  });

  const handleDetailClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailOpen(true);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setReasonError('');
    setCancelOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (!reason || !reason.trim()) {
      setReasonError('Vui lòng nhập lý do hủy lịch');
      return;
    }
    
    if (selectedAppointment) {
      cancelAppointment(selectedAppointment.id, reason);
      setAppointments(getAppointmentsByPatient(username));
      setCancelOpen(false);
      setSnackbar({
        open: true,
        message: 'Đã hủy lịch hẹn thành công',
        severity: 'success'
      });
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseCancel = () => {
    setCancelOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderAppointmentsTable = (appointmentsList) => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Chuyên khoa</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Bác sĩ</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ngày hẹn</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Giờ</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
            <TableCell sx={{ width: '120px' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointmentsList.length > 0 ? (
            appointmentsList.map(row => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" color="primary" fontWeight="medium">
                    {row.specialty || 'Không xác định'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{row.doctorName || row.doctor}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.doctorId || ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(row.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.time} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: '200px' }}>
                  <Typography variant="body2" noWrap>
                    {row.note || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={statusColor(row.status)} 
                    size="small"
                    sx={{ 
                      minWidth: '100px',
                      fontWeight: 'medium',
                      '& .MuiChip-label': { px: 1.5 }
                    }}
                  />
                  {row.cancelReason && (
                    <Typography variant="caption" color="error" display="block" mt={0.5}>
                      Lý do: {row.cancelReason}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button 
                    size="small" 
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDetailClick(row)}
                    startIcon={<InfoIcon fontSize="small" />}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 'medium',
                      mb: 0.5
                    }}
                  >
                    Chi tiết
                  </Button>
                  {row.status === 'Đã đăng ký' && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      fullWidth
                      onClick={() => handleCancelClick(row)}
                      startIcon={<CancelIcon fontSize="small" />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 'medium'
                      }}
                    >
                      Hủy lịch
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Box textAlign="center" py={2}>
                  {tabValue === 0 ? (
                    <>
                      <EventAvailableIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Chưa có lịch hẹn đang chờ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tất cả lịch hẹn đã đăng ký sẽ hiển thị tại đây.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <EventBusyIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Chưa có lịch sử
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Các lịch khám đã kết thúc sẽ hiển thị tại đây.
                      </Typography>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Helmet>
        <title>Quản lý lịch khám | Hệ thống phòng khám</title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản lý lịch khám
          </Typography>
        </Stack>
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 } }}>
          <Box display="flex" alignItems="center" mb={2}>
            <CalendarMonthIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="appointment tabs" 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                icon={<EventAvailableIcon />} 
                iconPosition="start"
                label={`Sắp đến (${upcomingAppointments.length})`} 
                id="upcoming-tab" 
                aria-controls="upcoming-tabpanel"
                {...a11yProps(0)}
              />
              <Tab 
                icon={<EventBusyIcon />} 
                iconPosition="start"
                label={`Kết thúc (${pastAppointments.length})`} 
                id="past-tab" 
                aria-controls="past-tabpanel"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                {renderAppointmentsTable(upcomingAppointments)}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderAppointmentsTable(pastAppointments)}
              </TabPanel>
            </>
          )}
        </Paper>

        {/* Dialog xem chi tiết */}
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center">
              <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Chi tiết lịch hẹn</Typography>
            </Box>
            <IconButton onClick={handleCloseDetail} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedAppointment && (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {selectedAppointment.specialty}
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Thời gian hẹn
                      </Typography>
                      <Typography variant="body1">
                        {format(parseISO(selectedAppointment.date), 'EEEE, dd/MM/yyyy')} • {selectedAppointment.time}
                      </Typography>
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Bác sĩ
                      </Typography>
                      <Typography variant="body1">
                        {selectedAppointment.doctorName}
                        {selectedAppointment.doctorPhone && (
                          <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            ({selectedAppointment.doctorPhone})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        <NotesIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Ghi chú
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedAppointment.note || 'Không có ghi chú'}
                      </Typography>
                    </Box>
                    
                    {selectedAppointment.symptoms && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          <NotesIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          Triệu chứng
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedAppointment.symptoms}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDetail} color="primary" variant="outlined">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog xác nhận hủy lịch */}
        <Dialog 
          open={cancelOpen} 
          onClose={handleCloseCancel} 
          maxWidth="sm" 
          fullWidth
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Xác nhận hủy lịch hẹn
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn hủy lịch hẹn <strong>{selectedAppointment?.specialty}</strong> với <strong>{selectedAppointment?.doctorName}</strong> 
              vào ngày <strong>{selectedAppointment?.date} lúc {selectedAppointment?.time}</strong>?
              <br />
              <br />
              Vui lòng nhập lý do hủy lịch của bạn:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              label="Lý do hủy lịch"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              required
              sx={{ mt: 2 }}
              error={!!reasonError}
              helperText={reasonError || ' '}
              inputProps={{
                'aria-label': 'Nhập lý do hủy lịch'
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCloseCancel} 
              color="inherit"
              sx={{ mr: 2 }}
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={() => {
                const reason = document.getElementById('reason').value;
                handleConfirmCancel(reason);
              }} 
              color="error"
              variant="contained"
              autoFocus
            >
              Xác nhận hủy
            </Button>
          </DialogActions>
        </Dialog>

        {/* Thông báo */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MyAppointments;
