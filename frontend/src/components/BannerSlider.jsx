import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

// Danh sách các ảnh banner, có thể mở rộng sau này
import bannerVinMec from "../assets/bannerVinMec.jpg";
import bannerVinMec2 from "../assets/bannerVinMec2.png";
import bannerVinMec3 from "../assets/bannerVinMec3.png";
import bannerVinMec4 from "../assets/bannerVinMec4.jpg";

const banners = [bannerVinMec, bannerVinMec2, bannerVinMec3, bannerVinMec4];

const BannerSlider = () => {
    const [current, setCurrent] = useState(0);
    const bannerCount = banners.length;
    // Tự động trượt
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % bannerCount);
        }, 4000);
        return () => clearInterval(timer);
    }, [bannerCount]);

    // Chuyển banner thủ công
    const handlePrev = () =>
        setCurrent((prev) => (prev - 1 + bannerCount) % bannerCount);
    const handleNext = () => setCurrent((prev) => (prev + 1) % bannerCount);

    return ( <
        Box sx = {
            {
                width: "1531px",
                height: "622.92px",
                position: "relative",
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
                boxShadow: 3,
                p: 0
            }
        } >
        { " " } {
            banners.map((img, idx) => ( <
                Box key = { idx }
                component = "img"
                src = { img }
                alt = { `Banner ${idx + 1}` }
                sx = {
                    {
                        width: "1531px",
                        height: "622.92px",
                        objectFit: "cover",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        opacity: idx === current ? 1 : 0,
                        transition: "opacity 0.8s",
                        zIndex: idx === current ? 2 : 1,
                        background: "white"
                    }
                }
                />
            ))
        } { " " } { /* Nút chuyển trái/phải */ } { " " } <
        Box sx = {
            {
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10
            }
        } >
        <
        button onClick = { handlePrev }
        style = {
            {
                background: "rgba(0,0,0,0.35)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                outline: "none"
            }
        } >
        { " " } { "<" } { " " } <
        /button>{" "} <
        /Box>{" "} <
        Box sx = {
            {
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10
            }
        } >
        <
        button onClick = { handleNext }
        style = {
            {
                background: "rgba(0,0,0,0.35)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                outline: "none"
            }
        } >
        { " " } { ">" } { " " } <
        /button>{" "} <
        /Box>{" "} { /* Chấm chỉ số dưới banner */ } { " " } <
        Box sx = {
            {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 16,
                display: "flex",
                justifyContent: "center",
                zIndex: 20
            }
        } >
        { " " } {
            banners.map((_, idx) => ( <
                Box key = { idx }
                sx = {
                    {
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: idx === current ? "#1976d2" : "#bbb",
                        mx: 0.5,
                        transition: "background 0.3s",
                        border: idx === current ? "2px solid #fff" : "none"
                    }
                }
                />
            ))
        } { " " } <
        /Box>{" "} <
        /Box>
    );
};

export default BannerSlider;