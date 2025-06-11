import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Danh sách tài khoản cố định để test
  const mockUsers = [
    { username: 'patient1', password: '123456', role: 'patient', name: 'Nguyễn Văn A' },
    { username: 'doctor1', password: '123456', role: 'doctor', name: 'BS. Trần Thị B' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Quản trị viên' }
  ];

  const login = useCallback(async (userData) => {
    // Tìm user trong danh sách mock (không kiểm tra role nữa)
    const user = mockUsers.find(u => 
      u.username === userData.username && 
      u.password === userData.password
    );

    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Lưu thông tin user (không lưu mật khẩu)
    const { password, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    // Note: We'll handle navigation in the component that calls logout
  }, []);

  const updateUserProfile = useCallback(async (userData) => {
    // Trong thực tế, đây sẽ là lời gọi API đến backend
    // Ở đây chúng ta chỉ cập nhật trong localStorage và state
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...currentUser, ...userData };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500); // Giả lập delay mạng
    });
  }, [currentUser]);

  const value = {
    currentUser,
    user: currentUser, // Alias for compatibility with existing code
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
