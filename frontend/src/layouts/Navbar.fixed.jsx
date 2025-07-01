import React, { useState } from "react";
import {
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
    Divider,
    ListItemIcon,
    ListItemText,
    Badge,
    Avatar,
    Tooltip
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HistoryIcon from "@mui/icons-material/History";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

// Import styled components
import {
    TopBar,
    TopBarContainer,
    TopBarContent,
    StyledAppBar,
    ToolbarContainer,
    LogoContainer,
    LogoImage,
    DesktopMenu,
    NavButton,
    AppointmentButton,
    MobileMenuButton,
    MobileMenu,
    MobileMenuItem,
    UserMenu,
    UserMenuItem
} from "./Navbar.styles.js";

// Menu items by role
const menuItemsByRole = {
    common: [],
    patient: [
        {
            label: "Đặt lịch khám",
            path: "/appointments",
            icon: <EventAvailableIcon fontSize="small" />
        },
        {
            label: "Quản lý lịch khám",
            path: "/my-appointments",
            icon: <HistoryIcon fontSize="small" />
        },
        {
            label: "Hồ sơ bệnh án",
            path: "/my-medical-records",
            icon: <MedicalInformationIcon fontSize="small" />
        }
    ],
    doctor: [
        {
            label: "Quản lý lịch khám",
            path: "/appointments",
            icon: <EventAvailableIcon fontSize="small" />
        },
        {
            label: "Hồ sơ bệnh nhân",
            path: "/patients",
            icon: <MedicalInformationIcon fontSize="small" />
        }
    ],
    admin: [
        {
            label: "Quản lý hệ thống",
            path: "/admin",
            icon: <SettingsIcon fontSize="small" />
        }
    ]
};

// Get menu items based on user role
const getMenuItems = (role) => {
    const commonItems = menuItemsByRole.common || [];
    const roleItems = menuItemsByRole[role] || [];
    return [...commonItems, ...roleItems];
};

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
        setHasNewNotifications(false);
    };

    const handleMobileMenuToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = isAuthenticated ? getMenuItems(user?.role) : [];

    return (
        <>
            {/* Top bar with phone number */}
            <TopBar>
                <TopBarContainer maxWidth="lg">
                    <TopBarContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Hotline: 1900 1234</Typography>
                        </Box>
                    </TopBarContent>
                </TopBarContainer>
            </TopBar>

            {/* Main navigation */}
            <StyledAppBar position="sticky" elevation={0}>
                <Container maxWidth={false} disableGutters sx={{ maxWidth: '1280px', mx: 'auto' }}>
                    <ToolbarContainer>
                        {/* Logo */}
                        <LogoContainer component={Link} to="/">
                            <LogoImage src="/logo.png" alt="Clinic Logo" />
                            <Typography variant="h6" component="div" sx={{ ml: 2, fontWeight: 'bold' }}>
                                Phòng Khám Đa Khoa
                            </Typography>
                        </LogoContainer>

                        {/* Desktop Menu */}
                        <DesktopMenu>
                            {menuItems.map((item) => (
                                <NavButton
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    {item.icon}
                                    <Box component="span" sx={{ ml: 1 }}>{item.label}</Box>
                                </NavButton>
                            ))}
                        </DesktopMenu>

                        {/* Right side - User actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            {isAuthenticated ? (
                                <>
                                    {/* Notifications */}
                                    <IconButton
                                        size="large"
                                        aria-label="show notifications"
                                        color="inherit"
                                        onClick={handleNotificationClick}
                                    >
                                        <Badge badgeContent={hasNewNotifications ? ' ' : 0} color="error" variant="dot">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>

                                    {/* User menu */}
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <Avatar 
                                            alt={user?.name || 'User'} 
                                            src={user?.avatar} 
                                            sx={{ width: 32, height: 32 }}
                                        />
                                    </IconButton>

                                    {/* User menu dropdown */}
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem component={Link} to="/profile" onClick={handleClose}>
                                            <ListItemIcon>
                                                <PersonIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Hồ sơ</ListItemText>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Đăng xuất</ListItemText>
                                        </MenuItem>
                                    </Menu>

                                    {/* Notifications dropdown */}
                                    <Menu
                                        anchorEl={notificationAnchorEl}
                                        open={Boolean(notificationAnchorEl)}
                                        onClose={handleNotificationClose}
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                Thông báo
                                            </Typography>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem>
                                            <Box sx={{ p: 1 }}>
                                                <Typography variant="body2">
                                                    Bạn không có thông báo mới.
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        color="inherit"
                                        sx={{ mr: 1 }}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                            )}

                            {/* Mobile menu button */}
                            <MobileMenuButton
                                color="inherit"
                                aria-label="open menu"
                                edge="end"
                                onClick={handleMobileMenuToggle}
                                sx={{ ml: 1 }}
                            >
                                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                            </MobileMenuButton>
                        </Box>
                    </ToolbarContainer>
                </Container>

                {/* Mobile menu */}
                <MobileMenu open={mobileOpen}>
                    <Container>
                        {menuItems.map((item) => (
                            <MobileMenuItem
                                key={item.path}
                                component={Link}
                                to={item.path}
                                onClick={handleMobileMenuToggle}
                            >
                                {item.icon}
                                <Box component="span" sx={{ ml: 2 }}>{item.label}</Box>
                            </MobileMenuItem>
                        ))}
                        {!isAuthenticated && (
                            <>
                                <MobileMenuItem component={Link} to="/login" onClick={handleMobileMenuToggle}>
                                    Đăng nhập
                                </MobileMenuItem>
                                <MobileMenuItem component={Link} to="/register" onClick={handleMobileMenuToggle}>
                                    Đăng ký
                                </MobileMenuItem>
                            </>
                        )}
                    </Container>
                </MobileMenu>
            </StyledAppBar>
        </>
    );
};

export default Navbar;
