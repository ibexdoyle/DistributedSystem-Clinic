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
  Button
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
  CheckCircle
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
        id: 1,
        patientName: 'Nguyễn Văn A',
        time: new Date(Date.now() + 3600000 * 2), // 2 hours from now
        service: 'Khám tổng quát',
        status: 'confirmed'
      },
      {
        id: 2,
        patientName: 'Trần Thị B',
        time: new Date(Date.now() + 3600000 * 4), // 4 hours from now
        service: 'Tái khám',
        status: 'confirmed'
      },
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
      width: '100%',
      p: 3,
      boxSizing: 'border-box',
      maxWidth: '100%',
      mx: 'auto'
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


      <Grid container spacing={3} sx={{ width: '100%', m: 0, maxWidth: '100%' }}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={12}>
          <Card sx={{ width: '100%', mx: 0 }}>
            <CardHeader 
              title="Cuộc hẹn sắp tới" 
              action={
                <Button 
                  size="small" 
                  onClick={() => navigate('/doctor/appointments')}
                >
                  Xem tất cả
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appt) => (
                    <React.Fragment key={appt.id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/doctor/appointments/${appt.id}`)}
                        secondaryAction={
                          <Chip 
                            label={appt.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                            color={appt.status === 'confirmed' ? 'primary' : 'default'}
                            size="small"
                          />
                        }
                      >
                        <ListItemIcon>
                          <Person color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={appt.patientName}
                          secondary={
                            <>
                              <Box component="span" display="flex" alignItems="center" mt={0.5}>
                                <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                {format(appt.time, 'HH:mm, EEE, dd/MM/yyyy', { locale: vi })}
                              </Box>
                              <Box component="span" display="flex" alignItems="center" mt={0.5}>
                                <LocalHospital fontSize="small" sx={{ mr: 0.5 }} />
                                {appt.service}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Không có cuộc hẹn sắp tới" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
