import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import entImg from "../assets/khoaTMH.jpg";

// Import doctor images
import bs1 from "../assets/bs1.png";
import bs2 from "../assets/bs2.jpg";
import bs3 from "../assets/bs3.jpg";
import bs4 from "../assets/bs4.jpg";

const doctors = [
    {
        id: 1,
        name: "PGS.TS. Trần Văn Hải",
        position: "Trưởng khoa Tai Mũi Họng",
        experience: "25 năm kinh nghiệm",
        specialty: "Phẫu thuật nội soi xoang, Mũi xoang dị ứng",
        image: bs1
    },
    {
        id: 2,
        name: "TS.BS. Lê Thị Hồng Nhung",
        position: "Phó khoa Tai Mũi Họng",
        experience: "18 năm kinh nghiệm",
        specialty: "Tai mũi họng trẻ em, Viêm amidan VA",
        image: bs2
    },
    {
        id: 3,
        name: "BS.CKII. Nguyễn Văn Tú",
        position: "Bác sĩ chuyên khoa",
        experience: "15 năm kinh nghiệm",
        specialty: "Phẫu thuật chỉnh hình mũi, Thẩm mỹ mũi",
        image: bs3
    },
    {
        id: 4,
        name: "ThS.BS. Phạm Thị Hằng",
        position: "Bác sĩ chuyên khoa",
        experience: "12 năm kinh nghiệm",
        specialty: "Điều trị nội khoa Tai Mũi Họng",
        image: bs4
    }
];

const ENTDepartment = () => {
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
                            Chuyên khoa Tai Mũi Họng
                        </h3>
                        <div className="title-underline" style={{
                           width: "15%",
                            height: "3px",
                            backgroundColor: "#e91e63",
                            margin: "0 0 15px 0"
                        }} />
                        <p style={{
                            fontSize: "16px",
                            lineHeight: "1.6",
                            textAlign: "left"
                        }}>
                            Khoa Tai Mũi Họng Bệnh viện Đa khoa Quốc tế Vinmec Phú Quốc được trang bị hệ thống máy móc hiện đại, áp dụng các kỹ thuật tiên tiến trong chẩn đoán và điều trị các bệnh lý về tai mũi họng cho mọi lứa tuổi.
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
                            backgroundColor: "#e91e63",
                            margin: "0 0 15px 0"
                        }} />
                        <ul style={{
                            paddingLeft: "20px",
                            fontSize: "16px",
                            lineHeight: "1.8"
                        }}>
                            <li style={{ marginBottom: "10px" }}>
                                Khám và điều trị các bệnh lý Tai Mũi Họng thông thường
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Phẫu thuật nội soi mũi xoang chức năng (FESS)
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Phẫu thuật cắt amidan, nạo VA bằng công nghệ Plasma
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Điều trị ù tai, nghe kém, chóng mặt
                            </li>
                            <li>Thẩm mỹ và tạo hình mũi, chỉnh hình vách ngăn</li>
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
                        Đội ngũ bác sĩ khoa Tai Mũi Họng
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
                                    color: "#e91e63"
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
                                        backgroundColor: '#e91e63',
                                        '&:hover': {
                                            backgroundColor: '#c2185b',
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
                            src={entImg} 
                            alt="Khoa Tai Mũi Họng" 
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
                                backgroundColor: "#e91e63",
                                '&:hover': {
                                    backgroundColor: "#c2185b"
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
                            color: "#e91e63",
                            marginBottom: "20px"
                        }}>
                            KHOA TAI MŨI HỌNG
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
                                    backgroundColor: activeTab === 'overview' ? "#e91e63" : "transparent",
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
                                    backgroundColor: activeTab === 'doctors' ? "#e91e63" : "transparent",
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

export default ENTDepartment;
