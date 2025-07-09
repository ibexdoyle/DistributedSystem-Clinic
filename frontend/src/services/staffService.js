import { patientApi } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

const staffService = {
  /**
   * Lấy danh sách tất cả nhân viên
   */
  getAllStaffs: async () => {
    try {
      const response = await patientApi.get(API_ENDPOINTS.STAFF.BASE);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching staffs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tải danh sách nhân viên'
      };
    }
  },

  /**
   * Lấy danh sách bác sĩ (role = 2)
   */
  getDoctors: async () => {
    try {
      const response = await patientApi.get(API_ENDPOINTS.STAFF.BASE);
      // Lọc lấy bác sĩ (role = 2)
      const doctors = response.data.filter(staff => staff.role === 2);
      
      return {
        success: true,
        data: doctors
      };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tải danh sách bác sĩ'
      };
    }
  },

  /**
   * Lấy danh sách chuyên khoa
   */
  getSpecializations: async () => {
    try {
      const response = await patientApi.get(API_ENDPOINTS.STAFF.BASE);
      // Lấy danh sách chuyên khoa duy nhất từ danh sách bác sĩ
      const specializations = [...new Set(
        response.data
          .filter(staff => staff.role === 2 && staff.specialization)
          .map(staff => staff.specialization)
      )];
      
      return {
        success: true,
        data: specializations
      };
    } catch (error) {
      console.error('Error fetching specializations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tải danh sách chuyên khoa'
      };
    }
  },

  /**
   * Lấy thông tin chi tiết bác sĩ theo ID
   */
  getDoctorById: async (doctorId) => {
    try {
      const response = await patientApi.get(`${API_ENDPOINTS.STAFF.BASE}/${doctorId}`);
      if (response.data.role !== 2) {
        throw new Error('Nhân viên này không phải là bác sĩ');
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching doctor with id ${doctorId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tải thông tin bác sĩ'
      };
    }
  }
};

export default staffService;
