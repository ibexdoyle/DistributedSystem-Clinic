import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { 
  Search, 
  Refresh, 
  Today, 
  EventAvailable,
  EventBusy,
  MedicalServices
} from '@mui/icons-material';
import { format, parseISO, isToday, isAfter } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '2025-06-04T09:00:00',
      status: 'confirmed',
      service: 'Khám tổng quát',
      phone: '0912345678'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '2025-06-04T10:30:00',
      status: 'pending',
      service: 'Tái khám',
      phone: '0987654321'
    },
  ]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Helper function to remove Vietnamese diacritics
  const removeAccents = (str) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = parseISO(appt.time);
    const searchTermLower = searchTerm.toLowerCase().trim();
    const patientNameLower = appt.patientName.toLowerCase();
    
    const matchesSearch = searchTerm === '' || 
      patientNameLower.includes(searchTermLower) ||
      removeAccents(patientNameLower).includes(removeAccents(searchTermLower)) ||
      appt.phone.includes(searchTerm);
      
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
    console.log('Bắt đầu khám:', appointmentId);
    // Xử lý bắt đầu khám
  };

  const handleCompleteAppointment = (appointmentId) => {
    console.log('Hoàn thành khám:', appointmentId);
    // Xử lý hoàn thành khám
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
                          label={appt.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                          color={appt.status === 'confirmed' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStartAppointment(appt.id)}
                          disabled={!isToday(parseISO(appt.time)) || appt.status !== 'confirmed'}
                          sx={{ mr: 1 }}
                        >
                          Bắt đầu
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCompleteAppointment(appt.id)}
                        >
                          Hoàn thành
                        </Button>
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
    </LocalizationProvider>
  );
};

export default AppointmentsPage;
