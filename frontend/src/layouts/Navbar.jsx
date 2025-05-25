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

// Các mục menu theo vai trò
const menuItemsByRole = {
    common: [],
    patient: [{
            label: "Đặt lịch khám",
            path: "/appointments",
            icon: < EventAvailableIcon fontSize = "small" / >
        },
        {
            label: "Lịch sử khám",
            path: "/my-appointments",
            icon: < HistoryIcon fontSize = "small" / >
        },
        {
            label: "Hồ sơ bệnh án",
            path: "/my-medical-records",
            icon: < MedicalInformationIcon fontSize = "small" / >
        }
    ],
    doctor: [{
            label: "Quản lý lịch khám",
            path: "/appointments",
            icon: < EventAvailableIcon fontSize = "small" / >
        },
        {
            label: "Hồ sơ bệnh nhân",
            path: "/patients",
            icon: < MedicalInformationIcon fontSize = "small" / >
        }
    ],
    admin: [{
        label: "Quản lý hệ thống",
        path: "/admin",
        icon: < SettingsIcon fontSize = "small" / >
    }]
};

// Hàm lấy menu items dựa trên vai trò
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
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Reset menu states when authentication state changes
    React.useEffect(() => {
        setAnchorEl(null);
        setNotificationAnchorEl(null);
    }, [isAuthenticated]);

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
        setHasNewNotifications(false);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNavigation = (path) => {
        if (path.startsWith("#")) {
            // Nếu là anchor link, cuộn đến phần tương ứng
            const element = document.getElementById(path.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(path);
        }
        if (mobileOpen) handleDrawerToggle();
    };

    const handleAppointmentClick = () => {
        handleNavigation("/appointments");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    const handleUserMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClick = () => {
        handleCloseUserMenu();
        navigate("/profile");
    };

    // Menu items based on user role
    const [specialtiesAnchorEl, setSpecialtiesAnchorEl] = useState(null);
    const [currentSpecialty, setCurrentSpecialty] = useState(null);

    const specialties = [
        { name: "Cấp cứu", path: "/specialties/cap-cuu" },
        { name: "Nhi", path: "/specialties/nhi" },
        { name: "Răng Hàm Mặt", path: "/specialties/rang-ham-mat" },
        { name: "Mắt", path: "/specialties/mat" },
        { name: "Tai Mũi Họng", path: "/specialties/tai-mui-hong" },
        { name: "Nội Tổng quát", path: "/specialties/noi-tong-quat" },
        { name: "Thần Kinh", path: "/specialties/than-kinh" },
        { name: "Ngoại tổng quát", path: "/specialties/ngoai-tong-quat" }
    ];

    const handleSpecialtiesMenuOpen = (event) => {
        setSpecialtiesAnchorEl(event.currentTarget);
    };

    const handleSpecialtiesMenuClose = () => {
        setSpecialtiesAnchorEl(null);
    };

    const handleSpecialtyClick = (specialty) => {
        setCurrentSpecialty(specialty.name);
        handleSpecialtiesMenuClose();
        // Navigate to the specialty page
        navigate(specialty.path);
    };

    const menuItems = [
        { label: "TRANG CHỦ", path: "/" },
        { label: "GIỚI THIỆU", path: "/about" },
        { label: "CHUYÊN KHOA", path: "#", hasDropdown: true },
        { label: "ĐỘI NGŨ BÁC SĨ", path: "/doctors" },
        { label: "TIN TỨC", path: "/news" },
        { label: "LIÊN HỆ", path: "/contact" }
    ];

    return ( <
        > { /* Top bar with phone number */ } <
        TopBar >
        <
        TopBarContainer maxWidth = "lg" >
        <
        TopBarContent >
        <
        PhoneIcon sx = {
            { mr: 1, fontSize: 18 } }
        /> <
        Typography variant = "body2" > Hotline: 0929 456 789 < /Typography> <
        /TopBarContent> <
        /TopBarContainer> <
        /TopBar>

        { /* Main navigation */ } <
        StyledAppBar position = "sticky"
        elevation = { 0 }
        sx = {
            { borderBottom: "1px solid rgba(0, 0, 0, 0.12)", width: "100%" } } >
        <
        Container maxWidth = { false }
        disableGutters sx = {
            { maxWidth: "1280px", mx: "auto" } } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "64px",
                px: { xs: 2, md: 4 },
                margin: "0 auto"
            }
        } >
        { /* Logo */ } <
        Box component = { Link }
        to = "/"
        sx = {
            {
                display: "flex",
                alignItems: "center",
                textDecoration: "none"
            }
        } >
        <
        LogoImage src = { require("../assets/logoVinmec.svg").default }
        alt = "Bệnh viện đa khoa Quốc tế Phú Quốc"
        onError = {
            (e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x50?text=LOGO";
            }
        }
        /> <
        /Box>

        { /* Main navigation */ } <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                "& > *": {
                    whiteSpace: "nowrap",
                    margin: "0 12px",
                    "&:first-of-type": {
                        marginLeft: 0
                    },
                    "&:last-child": {
                        marginRight: 0
                    }
                }
            }
        } >
        {
            menuItems.map((item, index) => {
                if (item.hasDropdown) {
                    return ( <
                        Box key = { index }
                        sx = {
                            { position: "relative" } } >
                        <
                        Box sx = {
                            {
                                position: "relative",
                                display: "inline-block"
                            }
                        }
                        onMouseEnter = { handleSpecialtiesMenuOpen }
                        onMouseLeave = { handleSpecialtiesMenuClose } >
                        <
                        NavButton component = "span"
                        sx = {
                            {
                                py: 1,
                                px: 2,
                                fontSize: "0.9375rem",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)"
                                }
                            }
                        }
                        aria - haspopup = "true" >
                        { item.label } <
                        /NavButton> <
                        Box sx = {
                            {
                                display: specialtiesAnchorEl ? "block" : "none",
                                position: "absolute",
                                left: 0,
                                zIndex: 1,
                                minWidth: "300px",
                                backgroundColor: "white",
                                boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                                borderRadius: "4px",
                                overflow: "hidden",
                                maxHeight: "400px",
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    width: "6px"
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                                    borderRadius: "3px"
                                }
                            }
                        } >
                        {
                            specialties.map((specialty, idx) => ( <
                                Box key = { idx }
                                onClick = {
                                    () => handleSpecialtyClick(specialty) }
                                sx = {
                                    {
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(25, 118, 210, 0.08)"
                                        }
                                    }
                                } >
                                <
                                Typography variant = "body2" > { specialty.name } <
                                /Typography> <
                                /Box>
                            ))
                        } <
                        /Box> <
                        /Box> <
                        /Box>
                    );
                }

                // Regular menu item
                let menuIcon = null;
                const allMenuItems = [
                    ...menuItemsByRole.patient,
                    ...menuItemsByRole.doctor,
                    ...menuItemsByRole.admin,
                    ...menuItemsByRole.common
                ];

                const menuItem = allMenuItems.find((i) => i.path === item.path);

                if (menuItem && menuItem.icon) {
                    menuIcon = React.cloneElement(menuItem.icon, {
                        sx: {
                            mr: 1,
                            fontSize: "1.1rem",
                            color: "inherit"
                        }
                    });
                }

                return ( <
                    NavButton key = { item.path }
                    component = { Link }
                    to = { item.path }
                    sx = {
                        {
                            py: 1,
                            px: 2,
                            fontSize: "0.9375rem",
                            display: "flex",
                            alignItems: "center",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)"
                            }
                        }
                    } >
                    { menuIcon } { item.label } <
                    /NavButton>
                );
            })
        }

        { /* User menu and notifications */ } {
            isAuthenticated ? ( <
                Box >
                <
                UserMenu anchorEl = { anchorEl }
                open = { Boolean(anchorEl) }
                onClose = { handleCloseUserMenu } >
                {
                    getMenuItems(user ? .role).map((item) => ( <
                        UserMenuItem key = { item.path }
                        component = { Link }
                        to = { item.path }
                        onClick = { handleCloseUserMenu } >
                        <
                        ListItemIcon > { item.icon } < /ListItemIcon> <
                        ListItemText > { item.label } < /ListItemText> <
                        /UserMenuItem>
                    ))
                } <
                MenuItem onClick = { handleProfileClick } >
                <
                ListItemIcon >
                <
                PersonIcon fontSize = "small" / >
                <
                /ListItemIcon> <
                ListItemText > Thông tin cá nhân < /ListItemText> <
                /MenuItem> <
                Divider / >
                <
                MenuItem onClick = { handleLogout } >
                <
                ListItemIcon >
                <
                LogoutIcon fontSize = "small" / >
                <
                /ListItemIcon> <
                ListItemText > Đăng xuất < /ListItemText> <
                /MenuItem> <
                /UserMenu>

                { /* Notification Menu */ } <
                Menu anchorEl = { notificationAnchorEl }
                open = { Boolean(notificationAnchorEl) }
                onClose = { handleNotificationClose }
                PaperProps = {
                    {
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            width: 350,
                            maxWidth: "100%",
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1
                            }
                        }
                    }
                }
                transformOrigin = {
                    { horizontal: "right", vertical: "top" } }
                anchorOrigin = {
                    { horizontal: "right", vertical: "bottom" } } >
                <
                MenuItem disabled >
                <
                Typography variant = "subtitle2"
                sx = {
                    { fontWeight: "bold" } } >
                Thông báo mới <
                /Typography> <
                /MenuItem> <
                Divider / >
                <
                MenuItem component = { Link }
                to = "/notifications"
                onClick = { handleNotificationClose } >
                <
                ListItemIcon >
                <
                EventAvailableIcon color = "primary" / >
                <
                /ListItemIcon> <
                ListItemText primary = "Lịch hẹn mới vào 14:00 ngày 25/05"
                secondary = "2 giờ trước" /
                >
                <
                /MenuItem> <
                MenuItem component = { Link }
                to = "/medical-records"
                onClick = { handleNotificationClose } >
                <
                ListItemIcon >
                <
                MedicalInformationIcon color = "primary" / >
                <
                /ListItemIcon> <
                ListItemText primary = "Kết quả xét nghiệm đã có"
                secondary = "Hôm qua" /
                >
                <
                /MenuItem> <
                Divider / >
                <
                MenuItem component = { Link }
                to = "/notifications"
                onClick = { handleNotificationClose } >
                <
                ListItemText primary = "Xem tất cả thông báo"
                sx = {
                    { textAlign: "center", color: "primary.main" } }
                /> <
                /MenuItem> <
                /Menu> <
                /Box>
            ) : (
                /* Appointment button - Only show for non-logged in users */
                <
                AppointmentButton variant = "contained"
                component = { Link }
                to = "/appointments"
                onClick = { handleAppointmentClick } >
                Đặt lịch hẹn <
                /AppointmentButton>
            )
        } <
        /Box>

        { /* Right side - Only show when user is logged in */ } {
            user ? ( <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        gap: 1,
                        pr: 1,
                        "& > *": {
                            display: "flex",
                            alignItems: "center"
                        }
                    }
                } >
                { /* Notification */ } <
                Box >
                <
                Tooltip title = "Thông báo" >
                <
                IconButton size = "medium"
                color = "inherit"
                onClick = { handleNotificationClick }
                sx = {
                    {
                        p: 0.5,
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)"
                        },
                        "&:focus": {
                            outline: "none"
                        }
                    }
                } >
                <
                Badge color = "error"
                variant = "dot"
                invisible = {!hasNewNotifications } >
                <
                NotificationsIcon / >
                <
                /Badge> <
                /IconButton> <
                /Tooltip> <
                /Box>

                { /* User Avatar */ } <
                Box >
                <
                Tooltip title = "Tài khoản" >
                <
                IconButton size = "medium"
                onClick = { handleUserMenuClick }
                color = "inherit"
                sx = {
                    {
                        p: 0.5,
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)"
                        }
                    }
                } >
                <
                Avatar alt = { user ? .name || "User" }
                src = { user ? .avatar }
                sx = {
                    {
                        width: 34,
                        height: 34,
                        bgcolor: "primary.main",
                        fontSize: "1rem",
                        border: "1px solid rgba(0, 0, 0, 0.1)"
                    }
                } >
                { user ? .name ? .charAt(0) || "U" } <
                /Avatar> <
                /IconButton> <
                /Tooltip> <
                /Box> <
                /Box>
            ) : null
        }

        { /* Mobile menu button */ } <
        MobileMenuButton color = "inherit"
        aria - label = "open drawer"
        edge = "end"
        onClick = { handleDrawerToggle } >
        { mobileOpen ? < CloseIcon / > : < MenuIcon / > } <
        /MobileMenuButton> <
        /Box> <
        /Container>

        { /* Mobile menu */ } {
            mobileOpen && ( <
                MobileMenu >
                <
                Container > {
                    menuItems.map((item) => ( <
                        MobileMenuItem key = { item.path }
                        component = { Link }
                        to = { item.path }
                        fullWidth onClick = { handleDrawerToggle } >
                        { item.label } <
                        /MobileMenuItem>
                    ))
                }

                {
                    isAuthenticated ? ( <
                        >
                        <
                        Divider sx = {
                            { my: 1 } }
                        /> {
                            getMenuItems(user ? .role).map((item) => ( <
                                MobileMenuItem key = { item.path }
                                component = { Link }
                                to = { item.path }
                                fullWidth onClick = { handleDrawerToggle } >
                                { item.label } <
                                /MobileMenuItem>
                            ))
                        } <
                        MobileMenuItem onClick = {
                            () => {
                                handleLogout();
                                handleDrawerToggle();
                            }
                        }
                        fullWidth >
                        <
                        ListItemIcon >
                        <
                        LogoutIcon fontSize = "small" / >
                        <
                        /ListItemIcon> <
                        ListItemText > Đăng xuất < /ListItemText> <
                        /MobileMenuItem> <
                        />
                    ) : ( <
                        MobileMenuItem component = { Link }
                        to = "/login"
                        fullWidth onClick = { handleDrawerToggle } >
                        <
                        ListItemIcon >
                        <
                        PersonIcon fontSize = "small" / >
                        <
                        /ListItemIcon> <
                        ListItemText > Đăng nhập < /ListItemText> <
                        /MobileMenuItem>
                    )
                }

                <
                Box sx = {
                    { p: 2, pt: 1 } } >
                <
                AppointmentButton variant = "contained"
                fullWidth component = { Link }
                to = "/appointments"
                onClick = {
                    () => {
                        handleAppointmentClick();
                        handleDrawerToggle();
                    }
                } >
                Đặt lịch hẹn <
                /AppointmentButton> <
                /Box> <
                /Container> <
                /MobileMenu>
            )
        } <
        /StyledAppBar> <
        />
    );
};

export default Navbar;