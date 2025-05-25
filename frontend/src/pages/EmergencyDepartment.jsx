import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import capcuuImg from "../assets/capcuu1.jpg";

// Import doctor images
import bs1 from "../assets/bs1.png";
import bs2 from "../assets/bs2.jpg";
import bs3 from "../assets/bs3.jpg";
import bs4 from "../assets/bs4.jpg";

const doctors = [
    {
        id: 1,
        name: "TS.BS. Nguyễn Văn A",
        position: "Trưởng khoa Cấp cứu",
        experience: "20 năm kinh nghiệm",
        specialty: "Cấp cứu đa khoa, Hồi sức tích cực",
        image: bs1
    },
    {
        id: 2,
        name: "ThS.BS. Trần Thị B",
        position: "Phó khoa Cấp cứu",
        experience: "15 năm kinh nghiệm",
        specialty: "Cấp cứu nhi, Hồi sức nhi",
        image: bs2
    },
    {
        id: 3,
        name: "BS. Lê Văn C",
        position: "Bác sĩ chuyên khoa",
        experience: "10 năm kinh nghiệm",
        specialty: "Cấp cứu chấn thương",
        image: bs3
    },
    {
        id: 4,
        name: "TS.BS. Phạm Thị D",
        position: "Bác sĩ chuyên khoa",
        experience: "12 năm kinh nghiệm",
        specialty: "Cấp cứu tim mạch",
        image: bs4
    }
];

const EmergencySection = () => {
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
                            Hoạt động 24/7
                        </h3>
                        <div className="title-underline" style={{
                           width: "15%",
                            height: "3px",
                            backgroundColor: "#8b0000",
                            margin: "0 0 15px 0"
                        }} />
                        <p style={{
                            fontSize: "16px",
                            lineHeight: "1.6",
                            textAlign: "left"
                        }}>
                            Tất cả các ngày trong tuần, kể cả Thứ 7, Chủ nhật và ngày lễ trong năm
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            textAlign: "left"
                        }}>
                            Uy tín & Phản ứng nhanh
                        </h3>
                        <div className="title-underline" style={{
                           width: "15%",
                            height: "3px",
                            backgroundColor: "#8b0000",
                            margin: "0 0 15px 0"
                        }} />
                        <ul style={{
                            paddingLeft: "20px",
                            fontSize: "16px",
                            lineHeight: "1.8"
                        }}>
                            <li style={{ marginBottom: "10px" }}>
                                Đội ngũ bác sĩ, nhân viên y tế được đào tạo bài bản, chuyên sâu về nhiều lĩnh vực hồi sức cấp cứu.
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                                Hỗ trợ đắc lực cho khoa Cấp cứu là đội ngũ thư ký chuyên môn phiên dịch viên đa ngôn ngữ.
                            </li>
                            <li>
                                Tất cả các xe cấp cứu chuyên dụng được trang bị hiện đại với hệ thống máy thở chuyên nghiệp.
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
                        Đội ngũ bác sĩ khoa Cấp cứu
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
                                    color: "#8b0000"
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
                                        backgroundColor: '#8b0000',
                                        '&:hover': {
                                            backgroundColor: '#6e0000',
                                        },
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        marginTop: '10px'
                                    }}
                                >
                                    Đăng ký khám
                                </Button>
                            </div>
                        ))}
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/doctors')}
                                sx={{
                                    padding: '8px 24px',
                                    borderRadius: '4px',
                                    borderColor: '#8b0000',
                                    color: '#8b0000',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: 'rgba(139, 0, 0, 0.04)',
                                        borderColor: '#8b0000'
                                    }
                                }}
                            >
                                Xem thêm
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ backgroundColor: "#f8f8f8", padding: "60px 0" }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 20px"
            }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h3 style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "15px",
                        color: "#333"
                    }}>
                        KHOA CẤP CỨU - HỒI SỨC TÍCH CỰC
                    </h3>
                    <div style={{
                        width: "80px",
                        height: "4px",
                        backgroundColor: "#8b0000",
                        margin: "0 auto 20px"
                    }} />
                    <p style={{
                        lineHeight: "1.6",
                        maxWidth: "800px",
                        margin: "0 auto",
                        color: "#555",
                        textAlign: "left"
                    }}>
                        Trong nhiều năm qua, Vinmec đã tiến hành cấp cứu và cứu sống những bệnh nhân nặng, phức tạp; thực hiện thành công nhiều sự việc cấp cứu lớn, cấp cứu hàng loạt. Hàng năm, các bệnh viện Vinmec tiếp nhận và cấp cứu thành công nhiều bệnh nhân hội chứng vành cấp, suy tim cấp theo đúng tiêu chuẩn của Hội tim mạch Hoa Kỳ (ACC/AHA), đột quỵ não theo đúng tiêu chuẩn ANGLES
                    </p>
                </div>

                <div style={{
                    display: "flex",
                    gap: "40px",
                    flexWrap: "wrap",
                    alignItems: "center"
                }}>
                    <div style={{ flex: "1 1 45%" }}>
                        <img 
                            src={capcuuImg}
                            alt="Cấp cứu"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>

                    <div style={{ 
                        flex: "1 1 45%",
                        color: "#333"
                    }}>
                        {/* Tab Navigation */}
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #ddd",
                            marginBottom: "20px"
                        }}>
                            <button
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    fontWeight: activeTab === 'overview' ? '600' : '400',
                                    color: activeTab === 'overview' ? '#8b0000' : '#555',
                                    backgroundColor: "transparent",
                                    border: "none",
                                    borderBottom: activeTab === 'overview' ? '2px solid #8b0000' : '2px solid transparent',
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab('doctors')}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    fontWeight: activeTab === 'doctors' ? '600' : '400',
                                    color: activeTab === 'doctors' ? '#8b0000' : '#555',
                                    backgroundColor: "transparent",
                                    border: "none",
                                    borderBottom: activeTab === 'doctors' ? '2px solid #8b0000' : '2px solid transparent',
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                Đội ngũ bác sĩ
                            </button>
                        </div>

                        {/* Tab Content */}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencySection;
