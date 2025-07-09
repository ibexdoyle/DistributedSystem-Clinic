import { patientApi } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

const appointmentService = {
  /**
   * Tạo lịch hẹn mới
   */
  createAppointment: async (appointmentData) => {
    try {
      const response = await patientApi.post(
        API_ENDPOINTS.APPOINTMENTS.BASE,
        appointmentData
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi đặt lịch hẹn'
      };
    }
  },

  /**
   * Lấy danh sách lịch hẹn của bệnh nhân
   */
  getPatientAppointments: async (patientId) => {
    try {
      const response = await patientApi.get(
        `${API_ENDPOINTS.APPOINTMENTS.BASE}/patient/${patientId}`
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi tải lịch hẹn'
      };
    }
  },

  /**
   * Hủy lịch hẹn
   */
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await patientApi.delete(
        `${API_ENDPOINTS.APPOINTMENTS.BASE}/${appointmentId}`
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error canceling appointment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi hủy lịch hẹn'
      };
    }
  },

  /**
   * Lấy danh sách khung giờ khám bệnh
   */
  getTimeSlots: async (doctorId, date) => {
    try {
      const response = await patientApi.get(
        `${API_ENDPOINTS.APPOINTMENTS.TIME_SLOTS}?doctorId=${doctorId}&date=${date}`
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi tải khung giờ khám bệnh'
      };
    }
  }
};

export default appointmentService;
