import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        Cookies.remove("token");
      }
    }
    setIsLoading(false);
  }, []);

 const login = async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();

      if (!response.ok) {
        let message = "Đăng nhập thất bại.";
        try {
          const data = JSON.parse(text);
          message = data.message || message;
        } catch {
          if (response.status === 403) {
            message = "Tài khoản hoặc mật khẩu không đúng.";
          }
        }
        throw new Error(message);
      }

      const data = JSON.parse(text);

      if (!data.token) throw new Error("Token không hợp lệ");

      Cookies.set("token", data.token, { expires: 7 });

      const decoded = jwtDecode(data.token);
      setUser(decoded);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isLoading }}>
      {" "}
      {!isLoading && children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
};