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
  AccessTime,
  Today,
  Person,
  EventAvailable,
  LocalHospital,
  EventBusy,
  CheckCircle,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalAppointments: 128,
      todayAppointments: 8,
      totalPatients: 56,
      completedAppointments: 120,
    });

    setUpcomingAppointments([
      {
        id: 'LH001',
        stt: '001',
        patientId: 'BN2024001',
        patientName: 'Nguyễn Văn A',
        phone: '0987654321',
        appointmentDate: new Date(Date.now() + 3600000 * 2),
        status: 'Đã xác nhận',
        actions: ['view', 'edit', 'delete']
      },
      {
        id: 'LH002',
        stt: '002',
        patientId: 'BN2024002',
        patientName: 'Trần Thị B',
        phone: '0912345678',
        appointmentDate: new Date(Date.now() + 3600000 * 4),
        status: 'Chờ xác nhận',
        actions: ['view', 'edit', 'delete']
      },
      {
        id: 'LH003',
        stt: '003',
        patientId: 'BN2024003',
        patientName: 'Lê Văn C',
        phone: '0905123456',
        appointmentDate: new Date(Date.now() + 3600000 * 6),
        status: 'Đã hủy',
        actions: ['view', 'delete']
      }
    ]);
  }, []); 

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
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      width: '100%',
      p: 3,
      boxSizing: 'border-box',
      mx: 0,
      '& > *': {
        minWidth: 0, // Prevent grid blowout
      }
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
        Tổng quan
      </Typography>
      
     {/* Stats Cards */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard 
      icon={<EventAvailable />} 
      title="Tổng cuộc hẹn" 
      value={stats.totalAppointments}
      color="#1976d2"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard 
      icon={<Today />} 
      title="Hôm nay" 
      value={stats.todayAppointments}
      color="#2e7d32"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard 
      icon={<People />} 
      title="Bệnh nhân" 
      value={stats.totalPatients}
      color="#ed6c02"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard 
      icon={<CheckCircle />} 
      title="Đã hoàn thành" 
      value={stats.completedAppointments}
      color="#9c27b0"
    />
  </Grid>
</Grid>


      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 3,
        width: '100%',
        m: 0,
        '& > *': {
          minWidth: 0, // Prevent grid items from overflowing
        }
      }}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={12}>
          <Card sx={{ width: '100%' }}>
            <CardHeader 
              title="Cuộc hẹn sắp tới" 
              action={
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => navigate('/doctor/appointments')}
                  sx={{ textTransform: 'none' }}
                >
                  Xem tất cả
                </Button>
              }
              sx={{ pb: 1 }}
            />
            <Divider />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>STT</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Mã lịch hẹn</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Số điện thoại</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Ngày hẹn</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5, textAlign: 'center' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appt) => (
                        <TableRow 
                          key={appt.id}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{appt.stt}</TableCell>
                          <TableCell>{appt.id}</TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2">{appt.patientName}</Typography>
                              <Typography variant="body2" color="text.secondary">Mã BN: {appt.patientId}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{appt.phone}</TableCell>
                          <TableCell>
                            {format(appt.appointmentDate, 'HH:mm, dd/MM/yyyy', { locale: vi })}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={appt.status}
                              size="small"
                              color={
                                appt.status === 'Đã xác nhận' ? 'success' :
                                appt.status === 'Chờ xác nhận' ? 'warning' : 'error'
                              }
                              sx={{ 
                                fontWeight: 500,
                                minWidth: 100,
                                '& .MuiChip-label': { px: 1.5 }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              {appt.actions.includes('view') && (
                                <Tooltip title="Xem chi tiết">
                                  <IconButton size="small" color="primary">
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {appt.actions.includes('edit') && (
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton size="small" color="warning">
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {appt.actions.includes('delete') && (
                                <Tooltip title="Xóa">
                                  <IconButton size="small" color="error">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
