import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';
import logoVinmec from "../assets/logoVinmec.svg";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  { text: 'Tổng quan', icon: <DashboardIcon />, path: '/doctor/dashboard' },
  { text: 'Lịch hẹn', icon: <EventIcon />, path: '/doctor/appointments' },
  { text: 'Hồ sơ bệnh án', icon: <AssignmentIcon />, path: '/doctor/medical-records' },
];

const DoctorLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState({ name: '', specialty: '', avatar: '' });

  const { logout } = useAuth();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.error('Không tìm thấy token.');
          return;
        }

        const decoded = jwtDecode(token);
        const email = decoded?.sub;

        if (!email) {
          console.error('Không tìm thấy email trong token.');
          return;
        }

        const res = await fetch('http://localhost:8083/api/staffs');
        if (!res.ok) throw new Error('Lỗi khi fetch danh sách staff');

        const staffList = await res.json();
        const doctor = staffList.find(
          s => s.email === email && (s.staffRole === 'DOCTOR' || s.staff_role === 'DOCTOR')
        );

        if (!doctor) {
          console.warn('Không tìm thấy bác sĩ tương ứng với email:', email);
          return;
        }

        setDoctorInfo({
          name: doctor.fullName,
          specialty: doctor.department,
          avatar: '', // hoặc có thể là doctor.avatar nếu có
        });
      } catch (err) {
        console.error('Lỗi khi lấy thông tin bác sĩ:', err);
      }
    };

    fetchDoctorInfo();
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setHasNewNotifications(false);
  };
  const handleNotificationClose = () => setNotificationAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-account-menu';

  const notifications = [
    { id: 1, message: 'Bạn có 3 cuộc hẹn sắp tới', read: false, time: '10 phút trước' },
    { id: 2, message: 'Bệnh nhân Nguyễn Văn A đã xác nhận lịch hẹn', read: false, time: '1 giờ trước' },
    { id: 3, message: 'Cập nhật phiên bản mới của hệ thống', read: true, time: '2 ngày trước' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerOpen} sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}></Typography>
          <Tooltip title="Thông báo">
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge variant="dot" color="error" invisible={!hasNewNotifications}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{ style: { width: 350 } }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1" fontWeight="bold">Thông báo</Typography>
            </MenuItem>
            <Divider />
            {notifications.map((n) => (
              <MenuItem key={n.id}>
                <ListItemText
                  primary={n.message}
                  secondary={n.time}
                  primaryTypographyProps={{
                    fontWeight: n.read ? 'normal' : 'medium',
                    fontSize: '0.9rem'
                  }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem><ListItemText primary="Xem tất cả thông báo" sx={{ textAlign: 'center' }} /></MenuItem>
          </Menu>

          <Tooltip title="Tài khoản">
            <IconButton onClick={handleProfileMenuOpen} color="inherit" sx={{ ml: 1 }}>
              <Avatar src={doctorInfo.avatar}>
                {doctorInfo.name ? doctorInfo.name.slice(0, 2).toUpperCase() : 'BS'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id={menuId}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/doctor/profile'); }}>
              <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
              Hồ sơ
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/doctor/settings'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Cài đặt
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <MuiDrawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box component={Link} to="/" sx={{ flexGrow: 1 }}>
              <img src={logoVinmec} alt="Vinmec" style={{ height: 40 }} />
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
            src={doctorInfo.avatar}
          >
            {doctorInfo.name ? doctorInfo.name.slice(0, 2).toUpperCase() : 'BS'}
          </Avatar>
          <Typography variant="subtitle1">{doctorInfo.name || 'Bác sĩ'}</Typography>
          <Typography variant="body2" color="text.secondary">{doctorInfo.specialty || 'Chuyên khoa'}</Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent' }}>
              <ListItemButton onClick={() => navigate(item.path)} sx={{ px: 2.5 }}>
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {React.cloneElement(item.icon, {
                    color: location.pathname === item.path ? 'primary' : 'inherit',
                  })}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                    color: location.pathname === item.path ? 'primary' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ px: 2.5 }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </ListItem>
        </List>
      </MuiDrawer>

      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
};

export default DoctorLayout;
