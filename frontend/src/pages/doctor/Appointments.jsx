import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Search, 
  Refresh, 
  Today, 
  EventAvailable,
  EventBusy,
  MedicalServices,
  MoreVert,
  PersonOff,
  CheckCircle,
  Cancel,
  HourglassEmpty
} from '@mui/icons-material';
import { format, parseISO, isToday, isAfter, addMinutes, isBefore, differenceInMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Các trạng thái lịch hẹn
const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

// Màu sắc cho từng trạng thái
const getStatusStyles = (status) => {
  switch(status) {
    case APPOINTMENT_STATUS.CONFIRMED:
      return {
        bgColor: '#e6f7e6',
        textColor: '#2e7d32',
        borderColor: '#c8e6c9'
      };
    case APPOINTMENT_STATUS.PENDING:
      return {
        bgColor: '#fff8e6',
        textColor: '#ed6c02',
        borderColor: '#ffe0b2'
      };
    case APPOINTMENT_STATUS.IN_PROGRESS:
      return {
        bgColor: '#e6f3ff',
        textColor: '#0288d1',
        borderColor: '#81d4fa'
      };
    case APPOINTMENT_STATUS.COMPLETED:
      return {
        bgColor: '#e6f7ff',
        textColor: '#0077b6',
        borderColor: '#b3e5fc'
      };
    case APPOINTMENT_STATUS.CANCELLED:
      return {
        bgColor: '#ffebee',
        textColor: '#d32f2f',
        borderColor: '#ef9a9a'
      };
    default: // NO_SHOW
      return {
        bgColor: '#f5f5f5',
        textColor: '#757575',
        borderColor: '#e0e0e0'
      };
  }
};

// Tên hiển thị cho từng trạng thái
const STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Chờ xác nhận',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Đã xác nhận',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'Đang khám',
  [APPOINTMENT_STATUS.COMPLETED]: 'Đã hoàn thành',
  [APPOINTMENT_STATUS.CANCELLED]: 'Đã hủy',
  [APPOINTMENT_STATUS.NO_SHOW]: 'Vắng mặt'
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: new Date().toISOString(),
      status: APPOINTMENT_STATUS.CONFIRMED,
      service: 'Khám tổng quát',
      phone: '0912345678',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: new Date(Date.now() + 30 * 60000).toISOString(),
      status: APPOINTMENT_STATUS.PENDING,
      service: 'Tái khám',
      phone: '0987654321',
      createdAt: new Date().toISOString()
    },
  ]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Kiểm tra và cập nhật trạng thái lịch hẹn dựa trên thời gian
  const checkAppointmentStatus = useCallback((appointment) => {
    const now = new Date();
    const apptTime = new Date(appointment.time);
    const timeDiff = differenceInMinutes(now, apptTime);
    
    // Nếu lịch hẹn đã quá 60 phút và vẫn ở trạng thái chờ hoặc đã xác nhận
    if (timeDiff > 60 && 
        (appointment.status === APPOINTMENT_STATUS.PENDING || 
         appointment.status === APPOINTMENT_STATUS.CONFIRMED)) {
      return APPOINTMENT_STATUS.NO_SHOW;
    }
    
    return appointment.status;
  }, []);

  // Cập nhật trạng thái lịch hẹn
  const updateAppointmentStatus = useCallback((appointmentId, newStatus) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appt => 
        appt.id === appointmentId 
          ? { ...appt, status: newStatus }
          : appt
      )
    );
  }, []);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (appointmentId, newStatus) => {
    setSelectedAppointment(appointments.find(a => a.id === appointmentId));
    setPendingAction(() => () => {
      updateAppointmentStatus(appointmentId, newStatus);
      setOpenConfirmDialog(false);
    });
    
    // Nếu là hành động cần xác nhận
    if (newStatus === APPOINTMENT_STATUS.CANCELLED || 
        newStatus === APPOINTMENT_STATUS.NO_SHOW) {
      setOpenConfirmDialog(true);
    } else {
      updateAppointmentStatus(appointmentId, newStatus);
    }
  };

  // Mở menu hành động
  const handleActionMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  // Đóng menu hành động
  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  // Xác nhận hành động
  const confirmAction = () => {
    if (pendingAction) {
      pendingAction();
    }
    setOpenConfirmDialog(false);
  };

  // Hủy bỏ hành động
  const cancelAction = () => {
    setOpenConfirmDialog(false);
    setPendingAction(null);
  };

  // Hàm xóa dấu tiếng Việt
  const removeAccents = (str) => {
    if (!str) return '';
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  // Kiểm tra và cập nhật trạng thái cho tất cả lịch hẹn
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => {
          const newStatus = checkAppointmentStatus(appt);
          if (newStatus !== appt.status) {
            return { ...appt, status: newStatus };
          }
          return appt;
        })
      );
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(interval);
  }, [checkAppointmentStatus]);

  const filteredAppointments = appointments
    .map(appt => ({
      ...appt,
      status: checkAppointmentStatus(appt)
    }))
    .filter(appt => {
      const apptDate = new Date(appt.time);
      const searchTermLower = searchTerm.toLowerCase().trim();
      const patientNameLower = (appt.patientName || '').toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        patientNameLower.includes(searchTermLower) ||
        removeAccents(patientNameLower).includes(removeAccents(searchTermLower)) ||
        (appt.phone || '').includes(searchTerm);
        
      const isUpcoming = isAfter(apptDate, new Date());
      const isSelectedDate = selectedDate ? 
        apptDate.toDateString() === selectedDate.toDateString() : 
        true;
        
      const matchesTab = 
        (tabValue === 0 && isToday(apptDate)) || // Hôm nay
        (tabValue === 1 && isUpcoming) || // Sắp tới
        (tabValue === 2); // Tất cả
        
      return matchesSearch && matchesTab && isSelectedDate;
  });

  const handleStartAppointment = (appointmentId) => {
    handleStatusChange(appointmentId, APPOINTMENT_STATUS.IN_PROGRESS);
  };

  const handleCompleteAppointment = (appointmentId) => {
    handleStatusChange(appointmentId, APPOINTMENT_STATUS.COMPLETED);
  };

  const handleCancelAppointment = (appointmentId) => {
    handleStatusChange(appointmentId, APPOINTMENT_STATUS.CANCELLED);
  };

  const handleMarkAsNoShow = (appointmentId) => {
    handleStatusChange(appointmentId, APPOINTMENT_STATUS.NO_SHOW);
  };

  const handleConfirmAppointment = (appointmentId) => {
    handleStatusChange(appointmentId, APPOINTMENT_STATUS.CONFIRMED);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth={false} sx={{ mt: 3, mb: 4, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
            Quản lý lịch khám
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  size="small" 
                  sx={{ width: 200 }} 
                />
              )}
            />
            
            <TextField
              size="small"
              placeholder="Tìm kiếm bệnh nhân..."
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
            
            <IconButton>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTabs-indicator': {
                height: 3
              }
            }}
          >
            <Tab label="Hôm nay" icon={<Today />} iconPosition="start" />
            <Tab label="Sắp tới" icon={<EventAvailable />} iconPosition="start" />
            <Tab label="Tất cả" icon={<EventBusy />} iconPosition="start" />
          </Tabs>
          
          <TableContainer sx={{ width: '100%' }}>
            <Table sx={{ minWidth: 1000 }}>
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
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt, index) => (
                    <TableRow key={appt.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{appt.patientName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appt.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(parseISO(appt.time), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{appt.service}</TableCell>
                      <TableCell>
                        <Chip 
                          label={STATUS_LABELS[appt.status]}
                          size="small"
                          sx={{
                            minWidth: 100,
                            fontWeight: 500,
                            '& .MuiChip-label': { px: 1.5 },
                            backgroundColor: getStatusStyles(appt.status).bgColor,
                            color: getStatusStyles(appt.status).textColor,
                            border: '1px solid',
                            borderColor: getStatusStyles(appt.status).borderColor
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {appt.status === APPOINTMENT_STATUS.PENDING && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleConfirmAppointment(appt.id)}
                              startIcon={<CheckCircle fontSize="small" />}
                            >
                              Xác nhận
                            </Button>
                          )}
                          
                          {appt.status === APPOINTMENT_STATUS.CONFIRMED && (
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => handleStartAppointment(appt.id)}
                              disabled={!isToday(new Date(appt.time))}
                              startIcon={<HourglassEmpty fontSize="small" />}
                            >
                              Bắt đầu
                            </Button>
                          )}
                          
                          {appt.status === APPOINTMENT_STATUS.IN_PROGRESS && (
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handleCompleteAppointment(appt.id)}
                              startIcon={<CheckCircle fontSize="small" />}
                            >
                              Hoàn thành
                            </Button>
                          )}
                          
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionMenuOpen(e, appt)}
                            disabled={[APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW].includes(appt.status)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Không có lịch hẹn nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Menu hành động */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
      >
        <MenuItem 
          onClick={() => handleCancelAppointment(selectedAppointment?.id)}
          disabled={[APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW].includes(selectedAppointment?.status)}
        >
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          Hủy lịch hẹn
        </MenuItem>
        <MenuItem 
          onClick={() => handleMarkAsNoShow(selectedAppointment?.id)}
          disabled={[APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW].includes(selectedAppointment?.status)}
        >
          <ListItemIcon>
            <PersonOff fontSize="small" />
          </ListItemIcon>
          Đánh dấu vắng mặt
        </MenuItem>
      </Menu>

      {/* Dialog xác nhận */}
      <Dialog
        open={openConfirmDialog}
        onClose={cancelAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận thao tác
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn thực hiện thao tác này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAction}>Hủy bỏ</Button>
          <Button onClick={confirmAction} autoFocus color="error">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AppointmentsPage;
