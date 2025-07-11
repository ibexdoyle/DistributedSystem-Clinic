import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  MedicalServices,
  People,
  Today,
  EventAvailable,
  CheckCircle,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
  });

  const [doctorInfo, setDoctorInfo] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) return;
        const decoded = jwtDecode(token);
        const email = decoded?.sub;

        const staffRes = await fetch('http://localhost:8083/api/staffs');
        const staffList = await staffRes.json();
        const doctor = staffList.find(s => s.email === email && (s.staffRole === 'DOCTOR' || s.staff_role === 'DOCTOR'));
        setDoctorInfo(doctor);
      } catch (err) {
        console.error('Error fetching doctor info:', err);
        setDoctorInfo(null);
      }
    };

    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorInfo?.id) return;
      try {
        const res = await fetch(`http://localhost:8084/api/appointments/doctor/${doctorInfo.id}`);
        const data = await res.json();

        const now = new Date();
        const inThreeDays = addDays(now, 3);

        const upcoming = data.filter(appt => {
          const apptDate = parseISO(appt.appointmentDateTime);
          return isWithinInterval(apptDate, { start: now, end: inThreeDays });
        }).map((appt, index) => ({
          id: appt.code || `LH${index + 1}`,
          stt: String(index + 1).padStart(3, '0'),
          patientId: appt.patientId || '-',
          patientName: appt.patientName || 'Bệnh nhân',
          phone: appt.patientPhone || '',
          appointmentDate: parseISO(appt.appointmentDateTime),
          status: appt.status === 'SCHEDULED' ? 'Đã xác nhận' : appt.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ xác nhận',
          actions: ['view']
        }));

        setUpcomingAppointments(upcoming);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setUpcomingAppointments([]);
      }
    };

    fetchAppointments();
  }, [doctorInfo]);

  const StatCard = ({ icon, title, value, color }) => (
    <Paper 
      sx={{ 
        p: 2, 
        height: '100%',
        borderLeft: `4px solid ${color}`,
        '&:hover': {
          boxShadow: 3,
        }
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: `${color}20`, color, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <MedicalServices sx={{ mr: 1 }} /> Tổng quan
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<EventAvailable />} title="Tổng cuộc hẹn" value={stats.totalAppointments} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<Today />} title="Hôm nay" value={stats.todayAppointments} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<People />} title="Bệnh nhân" value={stats.totalPatients} color="#ed6c02" />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CheckCircle />} title="Đã hoàn thành" value={stats.completedAppointments} color="#9c27b0" />
        </Grid> */}
      </Grid>

      <Card>
        <CardHeader 
          title="Cuộc hẹn sắp tới"
          action={<Button variant="outlined" onClick={() => navigate('/doctor/appointments')}>Xem tất cả</Button>}
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Mã lịch hẹn</TableCell>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày hẹn</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  {/* <TableCell align="center">Thao tác</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.stt}</TableCell>
                    <TableCell>{appt.id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{appt.patientName}</Typography>
                      <Typography variant="body2" color="textSecondary">Mã bệnh nhân: {appt.patientId}</Typography>
                    </TableCell>
                    <TableCell>{appt.phoneNumber}</TableCell>
                    <TableCell>{format(appt.appointmentDate, 'HH:mm, dd/MM/yyyy', { locale: vi })}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appt.status}
                        color={
                          appt.status === 'Đã xác nhận' ? 'success' :
                          appt.status === 'Chờ xác nhận' ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                    {/* <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell> */}
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
