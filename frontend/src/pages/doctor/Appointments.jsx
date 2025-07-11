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

        // Lấy danh sách bác sĩ
        const staffRes = await fetch('http://localhost:8083/api/staffs');
        if (!staffRes.ok) throw new Error('Lỗi khi fetch staff');

        const staffList = await staffRes.json();
        const doctor = staffList.find(s => s.email === email && (s.staffRole === 'DOCTOR' || s.staff_role === 'DOCTOR'));
        if (!doctor) throw new Error('Không tìm thấy bác sĩ');

        // Lấy lịch hẹn cho bác sĩ
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
                <TableCell>Dịch vụ</TableCell>
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
                    <TableCell>{appt.service}</TableCell>
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
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Không có lịch hẹn nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AppointmentsPage;
