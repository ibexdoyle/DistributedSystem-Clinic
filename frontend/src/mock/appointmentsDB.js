// Giả lập database lịch hẹn (dùng module variable, không bền vững khi reload)
let appointments = [
  // Dữ liệu mẫu
  {
    id: 1,
    patient: 'patient1',
    doctor: 'drA',
    doctorName: 'BS. Nguyễn Văn A',
    date: '2025-05-15',
    time: '08:00',
    note: 'Trám răng sâu ',
    status: 'Chờ xác nhận',
  }
];

export function addAppointment(appt) {
  appointments.push({ ...appt, id: Date.now() });
}

export function getAppointmentsByPatient(patient) {
  return appointments.filter(a => a.patient === patient);
}

export function getAppointmentsByDoctor(doctor) {
  return appointments.filter(a => a.doctor === doctor);
}

export function getAllAppointments() {
  return appointments;
}
