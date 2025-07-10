import React, { useEffect, useState } from 'react';
import { vi } from 'date-fns/locale';
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
// import { getAppointmentsByPatient, getAllAppointments, cancelAppointment } from '../mock/appointmentsDB';

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
  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  if (!user) {
    // Nếu chưa có user, tạo user demo để dev test nhanh
    user = {
      email: 'user@gmail.com',
      name: 'Người dùng',
      role: 'USER',
      permissions: ['VIEW_APPOINTMENT', 'CREATE_APPOINTMENT'],
    };
    localStorage.setItem('user', JSON.stringify(user));
  }
  const username = user && user.username ? user.username : '';
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]); // Danh sách bệnh nhân để map patientId sang name

  // Fetch danh sách bệnh nhân khi mount
  useEffect(() => {
    fetch('http://localhost:8082/api/patients')
      .then(res => res.ok ? res.json() : Promise.reject('Error fetching patients'))
      .then(data => setPatients(Array.isArray(data) ? data : [data]))
      .catch(() => setPatients([]));
  }, []);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setLoading(true);
    // Dùng biến user đã khai báo ở đầu component
    const email = user && user.email ? user.email : null;
    if (email) {
      console.log('Step 1: email from user:', email);
      fetch(`http://localhost:8082/api/patients?email=${encodeURIComponent(email)}`, {
        headers: { 'x-user-id': email }
      })
        .then(res => res.ok ? res.json() : Promise.reject('Error fetching patient by email'))
        .then(data => {
          console.log('Step 2: patient API response:', data);
          if (Array.isArray(data) && data.length > 0) {
            const patientId = data[0].id;
            console.log('Step 3: found patientId:', patientId);
            fetch(`http://localhost:8084/api/appointments/patient/${patientId}`, {
              headers: { 'X-User-Id': email }
            })
              .then(res => res.ok ? res.json() : Promise.reject('Error fetching appointments by patientId'))
              .then(data => {
                console.log('Step 4: appointments API response:', data);
                const appts = Array.isArray(data) ? data : [data];
                setAppointments(appts);
                setLoading(false);
              })
              .catch((err) => {
                console.error('Step 4 error:', err);
                setAppointments([]);
                setLoading(false);
              });
          } else {
            console.warn('Step 3: No patient found for email');
            setAppointments([]);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('Step 2 error:', err);
          setAppointments([]);
          setLoading(false);
        });
    } else {
      console.warn('Step 1: No email found in user');
      setAppointments([]);
      setLoading(false);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Phân loại lịch hẹn
  // Chỉ lấy các lịch sắp tới có status SCHEDULED
  const upcomingAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.appointmentDateTime);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate >= today && appt.status === 'SCHEDULED';
  });

  // Lịch sử chỉ lấy các lịch đã hoàn thành hoặc đã hủy
  const pastAppointments = appointments.filter(appt => appt.status === 'COMPLETED' || appt.status === 'CANCELLED');

  const handleDetailClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailOpen(true);
    setPatientDetail(null);
    if (appointment && appointment.patientId) {
      fetch(`http://localhost:8082/api/patients/${appointment.patientId}`)
        .then(res => res.ok ? res.json() : Promise.reject('Error fetching patient detail'))
        .then(data => {
          setPatientDetail(data);
        })
        .catch(() => setPatientDetail(null));
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      fetch(`http://localhost:8084/api/appointments/${selectedAppointment.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: selectedAppointment.id, status: 'CANCELLED' }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Cancel failed');
          // Sau khi hủy thành công, reload lại danh sách
          return fetch(`http://localhost:8084/api/appointments/patient/${selectedAppointment.patientId}`);
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setAppointments(Array.isArray(data) ? data : [data]);
          setSnackbar({
            open: true,
            message: 'Đã hủy lịch hẹn thành công',
            severity: 'success'
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: 'Hủy lịch thất bại',
            severity: 'error'
          });
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
            <TableCell sx={{ fontWeight: 'bold' }}>Họ tên</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ngày hẹn</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Giờ</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
            <TableCell sx={{ width: '120px' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointmentsList.length > 0 ? (
            appointmentsList.map(row => {
              // Tìm bệnh nhân theo patientId
              const patient = patients.find(
                p => String(p.id) === String(row.patientId) || String(p.patientId) === String(row.patientId)
              );
              if (!patient && row.patientId && patients.length > 0) {
                console.warn('Không tìm thấy bệnh nhân cho patientId:', row.patientId, patients);
              }
              return (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {row.medicalSpecialty || 'Không xác định'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.doctorName || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                  <Typography variant="body2">{patient ? patient.fullName : '--'}</Typography>

                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {row.appointmentDateTime ? format(parseISO(row.appointmentDateTime), 'EEEE, dd/MM/yyyy', { locale: vi }) : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.appointmentDateTime ? format(parseISO(row.appointmentDateTime), 'HH:mm') : ''} 
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
                  {row.status === 'SCHEDULED' && (
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
            );
          })
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
                        Chưa có lịch sử khám bệnh
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lịch sử khám bệnh và lịch đã hủy sẽ hiển thị tại đây.
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
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarMonthIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
          <Typography variant="h5" fontWeight={700}>Lịch khám của tôi</Typography>
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
              label={`Lịch sử (${pastAppointments.length})`} 
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
                {selectedAppointment.medicalSpecialty || selectedAppointment.specialty || 'Không xác định'}

                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Họ tên
                  </Typography>
                  <Typography variant="body1">
                  {patientDetail && (patientDetail.fullName || patientDetail.name) ? (patientDetail.fullName || patientDetail.name) : '--'}

                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Ngày sinh
                  </Typography>
                  <Typography variant="body1">
                    {patientDetail && patientDetail.dob ? format(new Date(patientDetail.dob), 'dd/MM/yyyy') : '--'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Giới tính
                  </Typography>
                  <Typography variant="body1">
                    {patientDetail && patientDetail.gender ? (patientDetail.gender === 'male' ? 'Nam' : patientDetail.gender === 'female' ? 'Nữ' : patientDetail.gender) : '--'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Thời gian hẹn
                    </Typography>
                    <Typography variant="body1">
                      {selectedAppointment.appointmentDateTime ? format(parseISO(selectedAppointment.appointmentDateTime), 'EEEE, dd/MM/yyyy', { locale: vi }) : ''}
                    </Typography>
                    <Typography variant="body1">
                      Giờ khám dự kiến: {selectedAppointment.appointmentDateTime ? format(parseISO(selectedAppointment.appointmentDateTime), 'HH:mm') : ''}
                      {selectedAppointment.timeEnd ? ` - ${format(parseISO(selectedAppointment.timeEnd), 'HH:mm')}` : ''}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Bác sĩ
                    </Typography>
                    <Typography variant="body1">
                      {selectedAppointment.doctorName}
                      {/* {selectedAppointment.doctorPhone && (
                        <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          ({selectedAppointment.doctorPhone})
                        </Typography>
                      )} */}
                    </Typography>
                  </Box>
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
      <Dialog open={cancelOpen} onClose={handleCloseCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Bạn có chắc chắn muốn hủy lịch hẹn {selectedAppointment?.specialty} với {selectedAppointment?.doctorName} 
            vào ngày {selectedAppointment?.date} lúc {selectedAppointment?.time}?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Lý do hủy lịch (không bắt buộc)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCancel} color="inherit">
            Hủy bỏ
          </Button>
          <Button 
            onClick={() => {
              const reason = document.getElementById('reason').value || 'Không có lý do';
              handleConfirmCancel(reason);
              handleCloseCancel();
            }} 
            color="error"
            variant="contained"
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
  );
};

export default MyAppointments;
