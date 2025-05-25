import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home as HomeIcon,
  CalendarMonth as AppointmentIcon,
  History as HistoryIcon,
  Assignment as MedicalRecordIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const patientMenu = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Đặt lịch khám', icon: <AppointmentIcon />, path: '/appointments' },
    { text: 'Lịch sử khám', icon: <HistoryIcon />, path: '/medical-history' },
    { text: 'Hồ sơ bệnh án', icon: <MedicalRecordIcon />, path: '/medical-records' },
    { text: 'Thông báo', icon: <NotificationIcon />, path: '/notifications', badge: 3 },
  ];

  const doctorMenu = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Quản lý lịch khám', icon: <AppointmentIcon />, path: '/doctor/appointments' },
    { text: 'Hồ sơ bệnh nhân', icon: <MedicalRecordIcon />, path: '/doctor/patients' },
    { text: 'Thông báo', icon: <NotificationIcon />, path: '/notifications', badge: 2 },
  ];

  const adminMenu = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Quản lý hệ thống', icon: <AppointmentIcon />, path: '/admin' },
    { text: 'Thông báo', icon: <NotificationIcon />, path: '/notifications' },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'patient': return patientMenu;
      case 'doctor': return doctorMenu;
      case 'admin': return adminMenu;
      default: return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Menu
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {getMenuItems().map((item, index) => (
            <ListItem 
              button 
              key={index} 
              component={Link} 
              to={item.path}
              onClick={onClose}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                padding: '12px 24px',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {item.badge && (
                <Box
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '10px',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    padding: '0 4px',
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ListItem>
          ))}
        </List>

        {user && (
          <>
            <Divider />
            <List>
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{
                  padding: '12px 24px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
