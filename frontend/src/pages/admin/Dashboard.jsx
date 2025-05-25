import React, { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Stack,
    Menu,
    MenuItem,
    Tooltip,
    Paper,
    Card,
    CardContent,
    Button,
    Grid
} from "@mui/material";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from "recharts";
import {
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    EventNote as EventNoteIcon,
    AttachMoney as MoneyIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Refresh as RefreshIcon,
    Receipt as ReceiptIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon
} from "@mui/icons-material";

const StatCard = ({
    title,
    value,
    change,
    isIncrease,
    icon: Icon,
    color,
    isMoney = false
}) => ( <
    Card sx = {
        {
            height: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }
    } >
    <
    CardContent >
    <
    Box sx = {
        {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
        }
    } >
    <
    Box >
    <
    Typography variant = "subtitle2"
    color = "text.secondary"
    gutterBottom > { title } <
    /Typography> <
    Box sx = {
        { display: "flex", alignItems: "center", mb: 1 } } >
    <
    Typography variant = "h5"
    fontWeight = "bold"
    sx = {
        { mr: 1 } } > { isMoney ? `${value}` : value } <
    /Typography> <
    Chip label = { `${isIncrease ? "+" : ""}${change}%` }
    size = "small"
    color = { isIncrease ? "success" : "error" }
    icon = {
        isIncrease ? ( <
            ArrowUpwardIcon fontSize = "small" / >
        ) : ( <
            ArrowDownwardIcon fontSize = "small" / >
        )
    }
    sx = {
        { height: 20, fontSize: "0.7rem" } }
    /> <
    /Box> <
    /Box> <
    Box sx = {
        {
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: `${color}.100`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: `${color}.main`
        }
    } >
    <
    Icon fontSize = "medium" / >
    <
    /Box> <
    /Box> <
    /CardContent> <
    /Card>
);

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState("Tuần này");
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Dữ liệu doanh thu
    const revenueData = [
        { name: "Tháng 1", value: 4000 },
        { name: "Tháng 2", value: 3000 },
        { name: "Tháng 3", value: 5000 },
        { name: "Tháng 4", value: 2780 },
        { name: "Tháng 5", value: 1890 },
        { name: "Tháng 6", value: 2390 }
    ];

    // Dữ liệu thống kê
    const stats = [{
            title: "Tổng bệnh nhân",
            value: "2,420",
            change: 12.5,
            isIncrease: true,
            icon: PeopleIcon,
            color: "primary"
        },
        {
            title: "Bác sĩ",
            value: "156",
            change: 5.2,
            isIncrease: true,
            icon: HospitalIcon,
            color: "secondary"
        },
        {
            title: "Lịch hẹn",
            value: "1,234",
            change: -2.1,
            isIncrease: false,
            icon: EventNoteIcon,
            color: "warning"
        },
        {
            title: "Doanh thu",
            value: "12,420",
            change: 18.3,
            isIncrease: true,
            icon: MoneyIcon,
            color: "success",
            isMoney: true
        }
    ];

    const [patientData] = useState([
        { name: "Thứ 2", patients: 20 },
        { name: "Thứ 3", patients: 35 },
        { name: "Thứ 4", patients: 25 },
        { name: "Thứ 5", patients: 40 },
        { name: "Thứ 6", patients: 30 },
        { name: "Thứ 7", patients: 45 },
        { name: "CN", patients: 20 }
    ]);

    const [genderData] = useState([
        { name: "Nam", value: 65, color: "#2196f3" },
        { name: "Nữ", value: 35, color: "#e91e63" }
    ]);

    const [recentAppointments] = useState([{
            id: "AP001",
            patient: "Nguyễn Văn A",
            doctor: "BS. Trần Thị B",
            date: "15/05/2023",
            time: "09:00",
            status: "Đã xác nhận"
        },
        {
            id: "AP002",
            patient: "Lê Thị C",
            doctor: "BS. Phạm Văn D",
            date: "15/05/2023",
            time: "10:30",
            status: "Đang chờ"
        },
        {
            id: "AP003",
            patient: "Hoàng Văn E",
            doctor: "BS. Nguyễn Thị F",
            date: "16/05/2023",
            time: "14:00",
            status: "Đã hủy"
        },
        {
            id: "AP004",
            patient: "Phạm Thị G",
            doctor: "BS. Trần Văn H",
            date: "16/05/2023",
            time: "15:30",
            status: "Đã xác nhận"
        },
        {
            id: "AP005",
            patient: "Vũ Văn I",
            doctor: "BS. Lê Thị K",
            date: "17/05/2023",
            time: "08:30",
            status: "Đang chờ"
        }
    ]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        handleMenuClose();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "Đã xác nhận":
                return ( <
                    Chip icon = { < CheckCircleIcon / > }
                    label = { status }
                    color = "success"
                    size = "small" /
                    >
                );
            case "Đang chờ":
                return ( <
                    Chip icon = { < PendingIcon / > }
                    label = { status }
                    color = "warning"
                    size = "small" /
                    >
                );
            case "Đã hủy":
                return ( <
                    Chip icon = { < CancelIcon / > }
                    label = { status }
                    color = "error"
                    size = "small" /
                    >
                );
            default:
                return <Chip label = { status }
                size = "small" / > ;
        }
    };

    // Apply pagination to recentAppointments
    const paginatedAppointments = recentAppointments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return ( <
        Box sx = {
            { flexGrow: 1, p: 3 } } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }
        } >
        <
        Typography variant = "h4"
        component = "h1"
        gutterBottom >
        Tổng quan <
        /Typography> <
        Box >
        <
        Button variant = "outlined"
        startIcon = { < RefreshIcon / > }
        onClick = {
            () => window.location.reload() }
        sx = {
            { mr: 1 } } >
        Làm mới <
        /Button> <
        Button variant = "outlined"
        startIcon = { < PrintIcon / > }
        sx = {
            { mr: 1 } } >
        In <
        /Button> <
        Button variant = "outlined"
        startIcon = { < ShareIcon / > }
        endIcon = { < MoreVertIcon / > }
        onClick = { handleMenuOpen } >
        { timeRange } <
        /Button> <
        Menu anchorEl = { anchorEl }
        open = { Boolean(anchorEl) }
        onClose = { handleMenuClose } >
        {
            ["Hôm nay", "Hôm qua", "Tuần này", "Tháng này", "Tùy chỉnh"].map(
                (option) => ( <
                    MenuItem key = { option }
                    onClick = {
                        () => handleTimeRangeChange(option) } >
                    { option } <
                    /MenuItem>
                )
            )
        } <
        /Menu> <
        /Box> <
        /Box>

        { /* Thống kê nhanh */ } <
        Grid container spacing = { 3 }
        sx = {
            { mb: 4 } } > {
            stats.map((stat, index) => ( <
                Grid item xs = { 12 }
                sm = { 6 }
                lg = { 3 }
                key = { index } >
                <
                StatCard title = { stat.title }
                value = { stat.value }
                change = { stat.change }
                isIncrease = { stat.isIncrease }
                icon = { stat.icon }
                color = { stat.color }
                isMoney = { stat.isMoney }
                /> <
                /Grid>
            ))
        } <
        Grid item xs = { 12 }
        sm = { 6 }
        lg = { 3 } >
        <
        StatCard title = "Đơn thuốc hôm nay"
        value = "45"
        change = { 5.2 }
        icon = { ReceiptIcon }
        color = "success" /
        >
        <
        /Grid> <
        Grid item xs = { 12 }
        sm = { 6 }
        lg = { 3 } >
        <
        StatCard title = "Lịch hẹn mới"
        value = "12"
        change = {-2.3 }
        icon = { HospitalIcon }
        color = "warning" /
        >
        <
        /Grid> <
        Grid item xs = { 12 }
        sm = { 6 }
        lg = { 3 } >
        <
        StatCard title = "Doanh thu tháng"
        value = "45,000,000₫"
        change = { 8.7 }
        icon = { MoneyIcon }
        color = "error"
        isMoney = { true }
        /> <
        /Grid> <
        /Grid>

        { /* Biểu đồ và bảng dữ liệu */ } <
        Grid container spacing = { 3 }
        sx = {
            { mb: 4 } } > { /* Biểu đồ bệnh nhân */ } <
        Grid item xs = { 12 }
        md = { 8 } >
        <
        Card elevation = { 3 } >
        <
        CardContent >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold" >
        Thống kê bệnh nhân <
        /Typography> <
        Box >
        <
        Button size = "small"
        color = { timeRange === "Tuần" ? "primary" : "inherit" }
        onClick = {
            () => setTimeRange("Tuần") } >
        Tuần <
        /Button> <
        Button size = "small"
        color = { timeRange === "Tháng" ? "primary" : "inherit" }
        onClick = {
            () => setTimeRange("Tháng") }
        sx = {
            { mx: 1 } } >
        Tháng <
        /Button> <
        Button size = "small"
        color = { timeRange === "Năm" ? "primary" : "inherit" }
        onClick = {
            () => setTimeRange("Năm") } >
        Năm <
        /Button> <
        /Box> <
        /Box> <
        Box sx = {
            { height: 300 } } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        LineChart data = { patientData }
        margin = {
            { top: 5, right: 30, left: 20, bottom: 5 } } >
        <
        CartesianGrid strokeDasharray = "3 3"
        vertical = { false }
        /> <
        XAxis dataKey = "name"
        axisLine = { false }
        tickLine = { false }
        /> <
        YAxis axisLine = { false }
        tickLine = { false }
        tickFormatter = {
            (value) => `${value}` }
        /> <
        RechartsTooltip contentStyle = {
            {
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }
        }
        /> <
        Line type = "monotone"
        dataKey = "patients"
        stroke = "#2196f3"
        strokeWidth = { 2 }
        dot = {
            { r: 4, fill: "#2196f3" } }
        activeDot = {
            { r: 6, stroke: "#2196f3", strokeWidth: 2 } }
        /> <
        /LineChart> <
        /ResponsiveContainer> <
        /Box> <
        /CardContent> <
        /Card> <
        /Grid>

        { /* Biểu đồ giới tính */ } <
        Grid item xs = { 12 }
        md = { 4 } >
        <
        Card >
        <
        CardContent >
        <
        Typography variant = "h6"
        gutterBottom >
        Tỷ lệ giới tính <
        /Typography> <
        Box sx = {
            { height: 300 } } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        PieChart >
        <
        Pie data = { genderData }
        cx = "50%"
        cy = "50%"
        innerRadius = { 60 }
        outerRadius = { 80 }
        paddingAngle = { 5 }
        dataKey = "value" >
        {
            genderData.map((entry, index) => ( <
                Cell key = { `cell-${index}` }
                fill = { entry.color }
                />
            ))
        } <
        /Pie> <
        RechartsTooltip formatter = {
            (value, name) => [`${value}%`, name] }
        contentStyle = {
            {
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }
        }
        /> <
        Legend / >
        <
        /PieChart> <
        /ResponsiveContainer> <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 2
            }
        } >
        {
            genderData.map((item, index) => ( <
                Box key = { index }
                sx = {
                    { display: "flex", alignItems: "center" } } >
                <
                Box sx = {
                    {
                        width: 12,
                        height: 12,
                        bgcolor: item.color,
                        borderRadius: "50%",
                        mr: 1
                    }
                }
                /> <
                Typography variant = "body2" > { item.name }: { item.value } %
                <
                /Typography> <
                /Box>
            ))
        } <
        /Box> <
        /Box> <
        /CardContent> <
        /Card> <
        /Grid>

        { /* Biểu đồ doanh thu */ } <
        Grid item xs = { 12 }
        md = { 4 } >
        <
        Card >
        <
        CardContent >
        <
        Typography variant = "h6"
        gutterBottom >
        Doanh thu theo tháng <
        /Typography> <
        Box sx = {
            { height: 300 } } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        LineChart data = { revenueData }
        margin = {
            { top: 5, right: 30, left: 20, bottom: 5 } } >
        <
        CartesianGrid strokeDasharray = "3 3"
        vertical = { false }
        /> <
        XAxis dataKey = "name"
        axisLine = { false }
        tickLine = { false }
        /> <
        YAxis axisLine = { false }
        tickLine = { false }
        tickFormatter = {
            (value) => `${value}` }
        /> <
        RechartsTooltip formatter = {
            (value) => [`${value}`, "Doanh thu"] }
        contentStyle = {
            {
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }
        }
        /> <
        Line type = "monotone"
        dataKey = "value"
        stroke = "#4caf50"
        strokeWidth = { 2 }
        dot = {
            { r: 4, fill: "#4caf50" } }
        activeDot = {
            { r: 6, stroke: "#4caf50", strokeWidth: 2 } }
        /> <
        /LineChart> <
        /ResponsiveContainer> <
        /Box> <
        /CardContent> <
        /Card> <
        /Grid>

        { /* Lịch hẹn gần đây */ } <
        Grid item xs = { 12 } >
        <
        Card elevation = { 3 } >
        <
        CardContent >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold" >
        Lịch hẹn gần đây <
        /Typography> <
        Button variant = "outlined"
        size = "small"
        startIcon = { < RefreshIcon fontSize = "small" / > }
        onClick = {
            () => window.location.reload() } >
        Làm mới <
        /Button> <
        /Box>

        <
        Box sx = {
            { overflowX: "auto" } } >
        <
        TableContainer >
        <
        Table size = "small" >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell > Bệnh nhân < /TableCell> <
        TableCell > Bác sĩ < /TableCell> <
        TableCell > Ngày < /TableCell> <
        TableCell > Giờ < /TableCell> <
        TableCell align = "center" > Trạng thái < /TableCell> <
        TableCell align = "right" > Hành động < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedAppointments.map((appointment) => ( <
                TableRow key = { appointment.id }
                hover >
                <
                TableCell >
                <
                Box sx = {
                    { display: "flex", alignItems: "center" } } >
                <
                Avatar sx = {
                    {
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        bgcolor: "primary.main"
                    }
                } >
                <
                PersonIcon fontSize = "small" / >
                <
                /Avatar> <
                Box >
                <
                Typography variant = "subtitle2" > { appointment.patient } <
                /Typography> <
                Typography variant = "caption"
                color = "text.secondary" >
                ID: { appointment.id } <
                /Typography> <
                /Box> <
                /Box> <
                /TableCell> <
                TableCell >
                <
                Typography variant = "body2" > { appointment.doctor } <
                /Typography> <
                /TableCell> <
                TableCell >
                <
                Typography variant = "body2" > { appointment.date } <
                /Typography> <
                /TableCell> <
                TableCell >
                <
                Chip icon = { < AccessTimeIcon fontSize = "small" / > }
                label = { appointment.time }
                size = "small"
                variant = "outlined" /
                >
                <
                /TableCell> <
                TableCell align = "center" > { getStatusChip(appointment.status) } <
                /TableCell> <
                TableCell align = "right" >
                <
                IconButton size = "small"
                color = "primary" >
                <
                PersonIcon fontSize = "small" / >
                <
                /IconButton> <
                IconButton size = "small"
                color = "primary" >
                <
                EventNoteIcon fontSize = "small" / >
                <
                /IconButton> <
                /TableCell> <
                /TableRow>
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25] }
        component = "div"
        count = { recentAppointments.length }
        rowsPerPage = { rowsPerPage }
        page = { page }
        onPageChange = { handleChangePage }
        onRowsPerPageChange = { handleChangeRowsPerPage }
        labelRowsPerPage = "Hàng mỗi trang:"
        labelDisplayedRows = {
            ({ from, to, count }) =>
            `${from}-${to} của ${count}`
        }
        /> <
        /Box> <
        /CardContent> <
        /Card> <
        /Grid>

        { /* Bảng thống kê bệnh nhân */ } <
        Grid item xs = { 12 } >
        <
        Paper sx = {
            { p: 3 } } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold" >
        Thống kê bệnh nhân <
        /Typography> <
        Button variant = "outlined"
        size = "small" >
        Xem tất cả <
        /Button> <
        /Box> <
        Box sx = {
            { height: 300 } } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        BarChart data = { patientData } >
        <
        CartesianGrid strokeDasharray = "3 3"
        vertical = { false }
        /> <
        XAxis dataKey = "name" / >
        <
        YAxis / >
        <
        RechartsTooltip / >
        <
        Legend / >
        <
        Bar dataKey = "patients"
        fill = "#4e73df"
        radius = {
            [4, 4, 0, 0] }
        name = "Số bệnh nhân" /
        >
        <
        /BarChart> <
        /ResponsiveContainer> <
        /Box> <
        /Paper> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default Dashboard;