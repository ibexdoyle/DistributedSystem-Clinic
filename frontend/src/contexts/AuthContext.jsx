import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = {
          id: decoded.id,
          email: decoded.sub,
          name: decoded.name || 'Người dùng',
          role: decoded.role || 'patient',
          ...decoded
        };
        setUser(userData);
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        Cookies.remove("token");
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    // Xóa user cũ và token trước khi login mới
    Cookies.remove("token");
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('user');
    }
    try {
      console.log('Đang thử đăng nhập với:', credentials);
      let response;
      try {
        response = await fetch("http://localhost:8081/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
      } catch (networkError) {
        console.error('Lỗi kết nối:', networkError);
        throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.");
      }

      console.log('Phản hồi từ máy chủ - Status:', response.status);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('Nội dung phản hồi thô:', responseText);
        
        // Thử parse JSON nếu có nội dung
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Lỗi khi phân tích phản hồi:', parseError);
        throw new Error(`Máy chủ trả về phản hồi không hợp lệ. Vui lòng thử lại sau.`);
      }

      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        // Xử lý các trường hợp lỗi cụ thể
        if (response.status === 401 || response.status === 403) {
          throw new Error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
        } else if (response.status === 400) {
          throw new Error(data.message || "Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.");
        } else if (response.status === 500) {
          throw new Error("Máy chủ đang gặp sự cố. Vui lòng thử lại sau.");
        } else {
          throw new Error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
        }
      }

      if (!data.token) {
        throw new Error("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.");
      }

      Cookies.set("token", data.token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      const decoded = jwtDecode(data.token);
      
      const userData = {
        id: decoded.id,
        email: decoded.sub,
        name: decoded.name || 'Người dùng',
        role: decoded.role || 'patient',
        ...decoded
      };
      
      setUser(userData);
      // Lưu thông tin user mới vào localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userEmail', userData.email || '');
        localStorage.setItem('userRole', userData.role || '');
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userPermissions', JSON.stringify(userData.permissions || []));
      }
      return userData;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Cookies.remove("token");
      setUser(null);
      // Rethrow with a user-friendly message if it's not already one
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
      }
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('user');
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  // Hàm cập nhật hồ sơ bệnh nhân theo email
  const updateUserProfile = async (formData) => {
    if (!user?.email) throw new Error("Không xác định được tài khoản!");
    const response = await fetch(`http://localhost:8082/api/patients?email=${encodeURIComponent(user.email)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.email
      },
      body: JSON.stringify({
        fullName: formData.get("name"),
        phoneNumber: formData.get("phone"),
        gender: formData.get("gender"),
        dob: (() => {
          const val = formData.get("dateOfBirth");
          if (!val) return null;
          if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
          const d = new Date(val);
          return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        })(),
        address: formData.get("address")
      })
    });
    if (!response.ok) {
      let msg = "Cập nhật thất bại";
      try {
        const errorData = await response.json();
        msg = errorData.message || msg;
      } catch {}
      throw new Error(msg);
    }
    // Có thể fetch lại thông tin mới nếu muốn
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasRole, 
      isLoading,
      updateUserProfile // expose
    }}>
      {!isLoading && children}
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