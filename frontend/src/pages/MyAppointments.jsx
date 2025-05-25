import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getAppointmentsByPatient, getAllAppointments } from '../mock/appointmentsDB';

const statusColor = status => {
  switch (status) {
    case 'Chờ xác nhận': return 'warning';
    case 'Đã xác nhận': return 'success';
    case 'Đã khám': return 'info';
    case 'Đã hủy': return 'error';
    default: return 'default';
  }
};

// Hàm xóa lịch khỏi mock DB (thực tế chỉ filter lại, vì mock DB là biến toàn cục)
function cancelAppointment(id) {
  const idx = getAllAppointments().findIndex(a => a.id === id);
  if (idx !== -1) {
    getAllAppointments()[idx].status = 'Đã hủy';
  }
}

const MyAppointments = () => {
  const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : '';
  const [appointments, setAppointments] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setAppointments(getAppointmentsByPatient(username));
  }, [username]);

  const handleCancel = (id) => {
    cancelAppointment(id);
    setAppointments(getAppointmentsByPatient(username));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarMonthIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
          <Typography variant="h5" fontWeight={700}>Lịch khám của tôi</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.doctorName || row.doctor}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.note || '-'}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={statusColor(row.status)} />
                  </TableCell>
                  <TableCell>
                    {row.status === 'Chờ xác nhận' && row.date >= today && (
                      <Button color="error" size="small" variant="outlined" onClick={() => handleCancel(row.id)}>
                        Hủy lịch
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default MyAppointments;
