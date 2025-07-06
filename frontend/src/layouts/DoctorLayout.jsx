import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
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
  Drawer,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  LocalHospital as MedicalRecordsIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

import logoVinmec from "../assets/logoVinmec.svg";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
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
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
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
  const [notifications] = useState([
    { id: 1, message: 'Bạn có 3 cuộc hẹn sắp tới', read: false, time: '10 phút trước' },
    { id: 2, message: 'Bệnh nhân Nguyễn Văn A đã xác nhận lịch hẹn', read: false, time: '1 giờ trước' },
    { id: 3, message: 'Cập nhật phiên bản mới của hệ thống', read: true, time: '2 ngày trước' },
  ]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    // Mark all notifications as read when opening the menu
    setHasNewNotifications(false);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/doctor/profile'); }}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Hồ sơ" />
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/doctor/settings'); }}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Cài đặt" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Thông báo">
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
                onClick={handleNotificationClick}
                sx={{ mx: 1 }}
              >
                <Badge badgeContent={hasNewNotifications ? ' ' : 0} color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                onClick={handleNotificationClose}
                PaperProps={{
                  style: {
                    width: '350px',
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Thông báo</Typography>
                </MenuItem>
                <Divider />
                {notifications.length > 0 ? (
                  <Box>
                    {notifications.map((notification) => (
                      <MenuItem key={notification.id}>
                        <ListItemText
                          primary={notification.message}
                          secondary={notification.time}
                          primaryTypographyProps={{
                            color: notification.read ? 'textSecondary' : 'textPrimary',
                            fontWeight: notification.read ? 'normal' : 'medium',
                            fontSize: '0.9rem'
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.75rem'
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Box>
                ) : (
                  <MenuItem disabled>
                    <ListItemText primary="Không có thông báo mới" />
                  </MenuItem>
                )}
                <Divider />
                <MenuItem>
                  <ListItemText primary="Xem tất cả thông báo" primaryTypographyProps={{ color: 'primary', textAlign: 'center', fontSize: '0.9rem' }} />
                </MenuItem>
              </Menu>
            </Tooltip>
            
            <Tooltip title="Tài khoản">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}
                  alt="Bác sĩ Nguyễn Văn A"
                  src="/static/images/avatar/1.jpg"
                >
                  BS
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexGrow: 1,
                textDecoration: 'none',
                '&:hover': { cursor: 'pointer' }
              }}
            >
              <img
                src={logoVinmec}
                alt="Vinmec Logo"
                style={{ height: 40, objectFit: "contain" }}
              />
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto',
              mb: 1,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem'
            }}
            alt="Bác sĩ Nguyễn Văn A"
            src="/static/images/avatar/1.jpg"
          >
            BS
          </Avatar>
          <Typography variant="subtitle1">Bác sĩ Nguyễn Văn A</Typography>
          <Typography variant="body2" color="text.secondary">
            Chuyên khoa Nội tổng quát
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ 
                display: 'block',
                bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent'
              }}
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit'
                  }}
                >
                  {React.cloneElement(item.icon, {
                    color: location.pathname === item.path ? 'primary' : 'inherit'
                  })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    color: location.pathname === item.path ? 'primary' : 'inherit',
                    fontWeight: location.pathname === item.path ? 'medium' : 'normal'
                  }}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Đăng xuất" 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
      {renderMenu}
    </Box>
  );
};

export default DoctorLayout;
