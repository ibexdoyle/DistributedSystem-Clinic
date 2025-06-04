import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import pediatricsImg from "../assets/khoaNhi.jpg";

// Import doctor images
import bs1 from "../assets/bs1.png";
import bs2 from "../assets/bs2.jpg";
import bs3 from "../assets/bs3.jpg";
import bs4 from "../assets/bs4.jpg";

const doctors = [
    {
        id: 1,
        name: "TS.BS. Nguyễn Thị Hồng",
        position: "Trưởng khoa Nhi",
        experience: "18 năm kinh nghiệm",
        specialty: "Nhi khoa, Hô hấp nhi",
        image: bs1
    },
    {
        id: 2,
        name: "ThS.BS. Lê Văn Minh",
        position: "Phó khoa Nhi",
        experience: "15 năm kinh nghiệm",
        specialty: "Tiêu hóa nhi, Dinh dưỡng nhi",
        image: bs2
    },
    {
        id: 3,
        name: "BS. Trần Thị Lan",
        position: "Bác sĩ chuyên khoa",
        experience: "10 năm kinh nghiệm",
        specialty: "Nhi khoa tổng quát",
        image: bs3
    },
    {
        id: 4,
        name: "TS.BS. Phạm Văn Tú",
        position: "Bác sĩ chuyên khoa",
        experience: "12 năm kinh nghiệm",
        specialty: "Thần kinh nhi, Tự kỷ",
        image: bs4
    }
];

const PediatricsDepartment = () => {
    const navigate = useNavigate();
    
    const handleBookAppointment = (doctor) => {
        navigate('/appointments', { state: { selectedDoctor: doctor } });
    };
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        if (activeTab === 'overview') {
            return (
                <>
                    <div style={{ marginBottom: "30px" }}>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            textAlign: "left"
                        }}>
                            Chăm sóc toàn diện cho trẻ em
                        </h3>
                        <div className="title-underline" style={{
                           width: "15%",
                            height: "3px",
                            backgroundColor: "#1976d2",
                            margin: "0 0 15px 0"
                        }} />
                        <p style={{
                            fontSize: "16px",
                            lineHeight: "1.6",
                            textAlign: "left"
                        }}>
                            Khoa Nhi Bệnh viện Đa khoa Quốc tế Vinmec Phú Quốc cung cấp các dịch vụ khám chữa bệnh toàn diện cho trẻ em từ sơ sinh đến 15 tuổi với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            textAlign: "left"
                        }}>
                            Dịch vụ nổi bật
                        </h3>
                        <div className="title-underline" style={{
                           width: "15%",
                            height: "3px",
                            backgroundColor: "#1976d2",
                            margin: "0 0 15px 0"
                        }} />
                        <ul style={{
                            paddingLeft: "20px",
                            fontSize: "16px",
                            lineHeight: "1.8"
                        }}>
                            <li style={{ marginBottom: "10px" }}>
                                Khám và điều trị các bệnh lý thường gặp ở trẻ em
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Tiêm chủng vắc xin theo lịch tiêm chủng mở rộng và dịch vụ
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Tư vấn dinh dưỡng và phát triển thể chất cho trẻ
                            </li>
                            <li>
                                Khám sức khỏe tổng quát và tầm soát bệnh lý bẩm sinh
                            </li>
                        </ul>
                    </div>
                </>
            );
        } else if (activeTab === 'doctors') {
            return (
                <div>
                    <h3 style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "20px",
                        color: "#333"
                    }}>
                        Đội ngũ bác sĩ khoa Nhi
                    </h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "20px",
                        marginTop: "20px"
                    }}>
                        {doctors.map(doctor => (
                            <div key={doctor.id} style={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                padding: "20px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}>
                                <div style={{
                                    width: "100%",
                                    height: "200px",
                                    marginBottom: "15px",
                                    borderRadius: "4px",
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5'
                                }}>
                                    <img 
                                        src={doctor.image} 
                                        alt={doctor.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top center'
                                        }}
                                    />
                                </div>
                                <h4 style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    marginBottom: "8px",
                                    color: "#1976d2"
                                }}>
                                    {doctor.name}
                                </h4>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#555",
                                    margin: "4px 0"
                                }}>
                                    <strong>Chức vụ:</strong> {doctor.position}
                                </p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#555",
                                    margin: "4px 0"
                                }}>
                                    <strong>Kinh nghiệm:</strong> {doctor.experience}
                                </p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#555",
                                    margin: "4px 0 15px 0"
                                }}>
                                    <strong>Chuyên khoa:</strong> {doctor.specialty}
                                </p>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleBookAppointment(doctor)}
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                >
                                    Đặt lịch khám
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <div style={{ padding: "40px 0" }}>
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
                <div style={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: "30px",
                    marginBottom: "40px"
                }}>
                    <div style={{
                        flex: "0 0 40%",
                        maxWidth: "40%"
                    }}>
                        <img 
                            src={pediatricsImg} 
                            alt="Khoa Nhi" 
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            fullWidth
                            sx={{
                                marginTop: "20px",
                                padding: "12px 24px",
                                backgroundColor: "#1976d2",
                                '&:hover': {
                                    backgroundColor: "#1565c0"
                                }
                            }}
                            onClick={() => navigate('/appointments')}
                        >
                            Đặt lịch khám ngay
                        </Button>
                    </div>
                    <div style={{
                        flex: "0 0 60%",
                        maxWidth: "60%"
                    }}>
                        <h1 style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#1976d2",
                            marginBottom: "20px"
                        }}>
                            KHOA NHI
                        </h1>
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #e0e0e0",
                            marginBottom: "20px"
                        }}>
                            <button
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    backgroundColor: activeTab === 'overview' ? "#1976d2" : "transparent",
                                    color: activeTab === 'overview' ? "white" : "#555",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderTopLeftRadius: "4px",
                                    borderTopRightRadius: "4px"
                                }}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab('doctors')}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    backgroundColor: activeTab === 'doctors' ? "#1976d2" : "transparent",
                                    color: activeTab === 'doctors' ? "white" : "#555",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderTopLeftRadius: "4px",
                                    borderTopRightRadius: "4px"
                                }}
                            >
                                Đội ngũ bác sĩ
                            </button>
                        </div>
                        <div style={{ padding: "20px 0" }}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PediatricsDepartment;
