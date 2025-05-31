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
}) => (
    <Card sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    }}>
        <CardContent>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
            }}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
                            {isMoney ? `${value} VNĐ` : value}
                        </Typography>
                        <Chip
                            label={`${isIncrease ? "+" : ""}${change}%`}
                            size="small"
                            color={isIncrease ? "success" : "error"}
                            icon={isIncrease ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                            sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: `${color}.100`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: `${color}.main`
                }}>
                    <Icon fontSize="medium" />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState("Tháng này");
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
            value: "45,250,000",
            change: 18.3,
            isIncrease: true,
            icon: MoneyIcon,
            color: "success",
            isMoney: true
        }
    ];

    // Dữ liệu biểu đồ cột: Số lượng bệnh nhân theo tháng
    const [patientData] = useState([
        { name: "Thg 1", patients: 1250 },
        { name: "Thg 2", patients: 1890 },
        { name: "Thg 3", patients: 2100 },
        { name: "Thg 4", patients: 1780 },
        { name: "Thg 5", patients: 2450 },
        { name: "Thg 6", patients: 2780 },
        { name: "Thg 7", patients: 1890 },
        { name: "Thg 8", patients: 2300 },
        { name: "Thg 9", patients: 2500 },
        { name: "Thg 10", patients: 2100 },
        { name: "Thg 11", patients: 2350 },
        { name: "Thg 12", patients: 3000 }
    ]);

    // Dữ liệu biểu đồ tròn: Tỷ lệ các dịch vụ khám
    const serviceData = [
        { name: "Khám tổng quát", value: 45, color: "#0088FE" },
        { name: "Khám chuyên khoa", value: 25, color: "#00C49F" },
        { name: "Xét nghiệm", value: 15, color: "#FFBB28" },
        { name: "Chẩn đoán hình ảnh", value: 10, color: "#FF8042" },
        { name: "Khác", value: 5, color: "#8884d8" }
    ];

    // Dữ liệu biểu đồ đường: Doanh thu theo tháng
    const revenueData = [
        { name: "Thg 1", revenue: 35000000 },
        { name: "Thg 2", revenue: 28900000 },
        { name: "Thg 3", revenue: 42500000 },
        { name: "Thg 4", revenue: 38100000 },
        { name: "Thg 5", revenue: 45200000 },
        { name: "Thg 6", revenue: 47800000 },
        { name: "Thg 7", revenue: 39000000 },
        { name: "Thg 8", revenue: 51200000 },
        { name: "Thg 9", revenue: 48700000 },
        { name: "Thg 10", revenue: 42300000 },
        { name: "Thg 11", revenue: 46500000 },
        { name: "Thg 12", revenue: 52000000 }
    ];

    // Custom tooltip cho biểu đồ
    const CustomTooltip = ({ active, payload, label, isMoney = false }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ 
                    background: 'white', 
                    padding: '8px 12px', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="body2" color="textSecondary">{label}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                        {isMoney ? `${payload[0].value.toLocaleString()} VNĐ` : payload[0].value}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    // Custom label cho biểu đồ tròn
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
        name
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '12px' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }}>
                <Typography variant="h4" fontWeight="bold">
                    Tổng quan
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PrintIcon fontSize="small" />}
                    >
                        In báo cáo
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShareIcon fontSize="small" />}
                    >
                        Chia sẻ
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon fontSize="small" />}
                        onClick={() => window.location.reload()}
                    >
                        Làm mới
                    </Button>
                </Box>
            </Box>

            {/* Thống kê nhanh */}
            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Biểu đồ 1 và 2: Bệnh nhân và Dịch vụ */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Biểu đồ 1: Số lượng bệnh nhân theo tháng */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Số lượng bệnh nhân theo tháng
                        </Typography>
                        <Box sx={{ height: 400, mt: 3 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={patientData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="patients" 
                                        fill="#8884d8" 
                                        name="Số bệnh nhân"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
                
                {/* Biểu đồ 2: Tỷ lệ các dịch vụ khám */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Tỷ lệ các dịch vụ khám
                        </Typography>
                        <Box sx={{ flex: 1, mt: 2, minHeight: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {serviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip formatter={(value, name) => [`${value}%`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Biểu đồ 3: Doanh thu theo tháng */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Doanh thu theo tháng (VNĐ)
                        </Typography>
                        <Box sx={{ height: 450, mt: 3 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                                    <RechartsTooltip formatter={(value) => [`${parseInt(value).toLocaleString()} VNĐ`, 'Doanh thu']} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
