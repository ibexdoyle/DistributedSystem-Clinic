// Giả lập database lịch hẹn (dùng module variable, không bền vững khi reload)
let appointments = [
  // Lịch hẹn sắp tới
  {
    id: 1,
    patient: 'patient1',
    patientName: 'Nguyễn Văn An',
    patientPhone: '0987654321',
    patientDob: '1990-05-15',
    patientGender: 'male',
    patientAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    doctor: 'drA',
    doctorId: 'BS001',
    doctorName: 'BS. Nguyễn Văn A',
    doctorPhone: '0912345678',
    specialty: 'Răng Hàm Mặt',
    specialtyId: 'RHM001',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày sau
    time: '08:00 - 08:30',
    note: 'Khám răng định kỳ, kiểm tra răng sâu',
    status: 'Đã đăng ký',
    diagnosis: '',
    prescription: '',
    medicines: []
  },
  // Lịch hẹn đã khám
  {
    id: 2,
    patient: 'patient1',
    patientName: 'Nguyễn Văn An',
    patientPhone: '0987654321',
    patientDob: '1990-05-15',
    patientGender: 'male',
    patientAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    doctor: 'drB',
    doctorId: 'BS002',
    doctorName: 'BS. Trần Thị B',
    doctorPhone: '0912345679',
    specialty: 'Tai Mũi Họng',
    specialtyId: 'TMH001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 ngày trước
    time: '14:00 - 14:30',
    status: 'Đã khám',
    diagnosis: 'Viêm họng cấp, sốt nhẹ',
    prescription: 'Sử dụng thuốc theo đơn, tái khám sau 5 ngày nếu không đỡ',
    medicines: [
      { id: 1, name: 'Paracetamol 500mg', quantity: '2 vỉ', usage: 'Uống 1 viên/lần, ngày 3 lần sau ăn' },
      { id: 2, name: 'Amoxicillin 500mg', quantity: '1 hộp', usage: 'Uống 1 viên/lần, ngày 2 lần sau ăn' },
      { id: 3, name: 'Dung dịch súc họng', quantity: '1 chai', usage: 'Súc họng 3-4 lần/ngày' }
    ]
  },
  // Lịch hẹn đã khám 2
  {
    id: 3,
    patient: 'patient1',
    patientName: 'Nguyễn Văn An',
    patientPhone: '0987654321',
    patientDob: '1990-05-15',
    patientGender: 'male',
    patientAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    doctor: 'drC',
    doctorId: 'BS003',
    doctorName: 'BS. Lê Văn C',
    doctorPhone: '0912345680',
    specialty: 'Da Liễu',
    specialtyId: 'DL001',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày trước
    time: '09:00 - 09:30',
    status: 'Đã khám',
    diagnosis: 'Viêm da dị ứng, ngứa, nổi mẩn đỏ',
    prescription: 'Tránh tiếp xúc với hóa chất, bôi thuốc theo đơn',
    medicines: [
      { id: 1, name: 'Eumovate cream 0.05%', quantity: '1 tuýp', usage: 'Bôi ngày 2 lần sáng tối' },
      { id: 2, name: 'Loratadine 10mg', quantity: '1 vỉ', usage: 'Uống 1 viên/ngày trước khi ngủ' },
      { id: 3, name: 'Kem dưỡng ẩm Cetaphil', quantity: '1 hộp', usage: 'Thoa ngày 2-3 lần khi da khô' }
    ]
  }
];

// Thêm lịch hẹn mới
function addAppointment(appt) {
  const newAppt = { 
    ...appt, 
    id: appointments.length + 1, 
    status: 'Đã đăng ký',
    diagnosis: appt.diagnosis || '',
    prescription: appt.prescription || '',
    medicines: appt.medicines || []
  };
  appointments.push(newAppt);
  return newAppt;
}

// Lấy lịch hẹn theo bệnh nhân
function getAppointmentsByPatient(patient) {
  return appointments.filter(appt => appt.patient === patient);
}

// Lấy lịch hẹn theo bác sĩ
function getAppointmentsByDoctor(doctor) {
  return appointments.filter(appt => appt.doctor === doctor);
}

// Lấy tất cả lịch hẹn
function getAllAppointments() {
  return [...appointments];
}

// Hủy lịch hẹn
function cancelAppointment(id, reason = '') {
  const index = appointments.findIndex(appt => appt.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      status: 'Đã hủy',
      cancelReason: reason,
      updatedAt: new Date().toISOString()
    };
    return true;
  }
  return false;
}

export {
  addAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAllAppointments,
  cancelAppointment
};
