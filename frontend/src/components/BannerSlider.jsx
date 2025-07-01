import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

// Dữ liệu banner
const bannerData = [
  {
    id: 1,
    image: require("../assets/bannerVinMec1.png"),
    title: "Bệnh Viện Đa Khoa VinMec Phú Quốc",
    subtitle: "CHĂM SÓC SỨC KHỎE CỦA BẠN VỚI ĐỘI NGŨ BÁC SĨ CHUYÊN NGHIỆP",
    buttonText: "ĐẶT LỊCH KHÁM NGAY"
  },
  {
    id: 2,
    image: require("../assets/bannerVinMec2.png"),
    title: "DỊCH VỤ Y TẾ CHẤT LƯỢNG CAO",
    subtitle: "Trang thiết bị hiện đại - Chăm sóc tận tâm",
    buttonText: "TÌM HIỂU THÊM"
  },
  {
    id: 3,
    image: require("../assets/bannerVinMec3.png"),
    title: "CƠ SỞ VẬT CHẤT HIỆN ĐẠI",
    subtitle: "Môi trường khám chữa bệnh đạt tiêu chuẩn quốc tế",
    buttonText: "THAM QUAN BỆNH VIỆN"
  },
  {
    id: 4,
    image: require("../assets/bannerVinMec4.jpg"),
    title: "ĐỘI NGŨ CHUYÊN GIA ĐẦU NGÀNH",
    subtitle: "Được đào tạo bài bản và giàu kinh nghiệm",
    buttonText: "XEM CHUYÊN GIA"
  }
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const bannerCount = bannerData.length;
  
  // Tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerCount]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + bannerCount) % bannerCount);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerCount);
  };

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "400px", md: "600px" },
        position: "relative",
        overflow: "hidden",
        mb: 4,
        boxShadow: 3,
      }}
    >
      {/* Các slide */}
      {bannerData.map((banner, idx) => (
        <Box
          key={banner.id}
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            src={banner.image}
            alt={banner.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.4)",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              px: 2,
              color: "white",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1.8rem", md: "3rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {banner.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                maxWidth: "800px",
                fontSize: { xs: "1.1rem", md: "1.5rem" },
                textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              {banner.subtitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "30px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                bgcolor: "#00a0dc",
                "&:hover": {
                  bgcolor: "#0088c1",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {banner.buttonText}
            </Button>
          </Box>
        </Box>
      ))}

      {/* Nút điều hướng */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          zIndex: 3,
        }}
      >
        <NavigationButton direction="prev" onClick={handlePrev} />
        <NavigationButton direction="next" onClick={handleNext} />
      </Box>

      {/* Chấm chỉ số */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          zIndex: 3,
        }}
      >
        {bannerData.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => handleDotClick(idx)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: current === idx ? "#00a0dc" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: current === idx ? "#0088c1" : "rgba(255,255,255,0.8)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Component nút điều hướng
const NavigationButton = ({ direction, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 44,
      height: 44,
      borderRadius: "50%",
      bgcolor: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        bgcolor: "rgba(0,0,0,0.6)",
        transform: "scale(1.1)",
      },
    }}
  >
    {direction === "prev" ? "<" : ">"}
  </Box>
);

export default BannerSlider;