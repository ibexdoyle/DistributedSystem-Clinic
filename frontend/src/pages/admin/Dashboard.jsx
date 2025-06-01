import React, { useState } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { 
    Box, 
    Typography, 
    Paper, 
    useTheme,
    IconButton,
    CardContent,
    Chip
} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
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
    LocalHospital as LocalHospitalIcon,
    EventAvailable as EventAvailableIcon,
    MonetizationOn as MonetizationOnIcon,
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
            icon: PersonIcon,
            color: "primary"
        },
        {
            title: "Bác sĩ",
            value: "156",
            change: 5.2,
            isIncrease: true,
            icon: LocalHospitalIcon,
            color: "secondary"
        },
        {
            title: "Lịch hẹn",
            value: "1,234",
            change: -2.1,
            isIncrease: false,
            icon: EventAvailableIcon,
            color: "warning"
        },
        {
            title: "Doanh thu",
            value: "45,250,000",
            change: 18.3,
            isIncrease: true,
            icon: MonetizationOnIcon,
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

    // Dữ liệu biểu đồ: Số lượng đơn thuốc đã cấp
    const prescriptionData = [
        { name: "Thg 1", prescriptions: 1024 },
        { name: "Thg 2", prescriptions: 980 },
        { name: "Thg 3", prescriptions: 1250 },
        { name: "Thg 4", prescriptions: 1120 },
        { name: "Thg 5", prescriptions: 1340 },
        { name: "Thg 6", prescriptions: 1450 },
        { name: "Thg 7", prescriptions: 1180 },
        { name: "Thg 8", prescriptions: 1560 },
        { name: "Thg 9", prescriptions: 1480 },
        { name: "Thg 10", prescriptions: 1320 },
        { name: "Thg 11", prescriptions: 1420 },
        { name: "Thg 12", prescriptions: 1650 }
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
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col xs={12} md={6}>
                    <h2 className="mb-0 fw-bold">Tổng quan</h2>
                </Col>
                <Col xs={12} md={6} className="mt-3 mt-md-0 d-flex justify-content-md-end">
                    <ButtonGroup>
                        <Button variant="outline-secondary" size="sm" onClick={() => window.location.reload()}>
                            <RefreshIcon fontSize="small" className="me-1" /> Làm mới
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                            <PrintIcon fontSize="small" className="me-1" /> In báo cáo
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                            <ShareIcon fontSize="small" className="me-1" /> Chia sẻ
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>

            {/* Stat Cards */}
            <Row className="mb-4 g-3">
                {stats.map((stat, index) => (
                    <Col key={index} xs={12} sm={6} lg={3}>
                        <Card className="h-100 shadow-sm border-0 rounded-3">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="p-3 rounded-3 me-3" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                                        <PeopleIcon style={{ color: '#6366F1', fontSize: '1.5rem' }} />
                                    </div>
                                    <div>
                                        <p className="text-muted mb-1">{stat.title}</p>
                                        <h4 className="mb-0 fw-bold">
                                            {stat.isMoney ? `${parseInt(stat.value).toLocaleString()} VNĐ` : stat.value}
                                        </h4>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className={`badge bg-${stat.isIncrease ? 'success' : 'danger'}-subtle text-${stat.isIncrease ? 'success' : 'danger'} p-1`}>
                                        {stat.isIncrease ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                        {stat.change}% so với tháng trước
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Chart Row 1 */}
            <Row className="mb-4 g-3">
                {/* Patient Chart */}
                <Col xs={12} lg={8}>
                    <Card className="h-100 shadow-sm border-0 rounded-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 fw-bold">Số lượng bệnh nhân theo tháng</h5>
                                <ButtonGroup size="sm">
                                    <Button variant="outline-secondary">Tháng</Button>
                                    <Button variant="outline-secondary">Quý</Button>
                                    <Button variant="outline-secondary">Năm</Button>
                                </ButtonGroup>
                            </div>
                            <div style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={patientData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Bar 
                                            dataKey="patients" 
                                            fill="#6366F1" 
                                            name="Số bệnh nhân"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Service Distribution */}
                <Col xs={12} lg={4}>
                    <Card className="h-100 shadow-sm border-0 rounded-3">
                        <Card.Body className="d-flex flex-column">
                            <h5 className="mb-3 fw-bold">Tỷ lệ các dịch vụ khám</h5>
                            <div style={{ flex: 1, minHeight: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={serviceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={100}
                                            innerRadius={60}
                                            dataKey="value"
                                            nameKey="name"
                                        >
                                            {serviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Revenue Chart */}
            <Row className="mb-4">
                <Col xs={12}>
                    <Card className="shadow-sm border-0 rounded-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 fw-bold">Doanh thu theo tháng (VNĐ)</h5>
                                <div className="d-flex">
                                    <ButtonGroup size="sm" className="me-2">
                                        <Button variant="outline-secondary">2024</Button>
                                        <Button variant="outline-secondary">2023</Button>
                                    </ButtonGroup>
                                    <ButtonGroup size="sm">
                                        <Button variant="outline-secondary">Xuất Excel</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                                        />
                                        <RechartsTooltip 
                                            formatter={(value) => [`${parseInt(value).toLocaleString()} VNĐ`, 'Doanh thu']}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Doanh thu"
                                            stroke="#6366F1"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Prescription Chart */}
            <Row className="mb-4">
                <Col xs={12}>
                    <Card className="shadow-sm border-0 rounded-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 fw-bold">Số lượng đơn thuốc đã cấp</h5>
                                <div className="d-flex">
                                    <ButtonGroup size="sm" className="me-2">
                                        <Button variant="outline-secondary">2024</Button>
                                        <Button variant="outline-secondary">2023</Button>
                                    </ButtonGroup>
                                    <ButtonGroup size="sm">
                                        <Button variant="outline-secondary">Xuất Excel</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={prescriptionData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false}
                                        />
                                        <RechartsTooltip 
                                            formatter={(value) => [`${value} đơn`, 'Số đơn thuốc']}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="prescriptions"
                                            name="Số đơn thuốc"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
