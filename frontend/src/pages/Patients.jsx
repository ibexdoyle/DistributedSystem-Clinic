import React, { useState } from 'react';
import { Container, Typography, Button, TextField } from '@mui/material';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';
import PatientDetail from '../components/PatientDetail';
const mockPatients = [
  { id: 1, name: 'Nguyễn Văn A', dob: '1990-01-01', gender: 'Nam', phone: '0901234567', address: 'Hà Nội' },
  { id: 2, name: 'Trần Thị B', dob: '1985-05-12', gender: 'Nữ', phone: '0912345678', address: 'Hồ Chí Minh' },
];
const mockHistory = [
  { date: '2024-01-01', doctor: 'BS. Lê Văn C', diagnosis: 'Cảm cúm', note: 'Nghỉ ngơi, uống nhiều nước' },
  { date: '2024-03-15', doctor: 'BS. Nguyễn Thị D', diagnosis: 'Viêm họng', note: 'Kháng sinh 5 ngày' },
];

const Patients = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const myInfo = user && (patients.find(p => p.username === user.username || p.name === user.username) || {});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...myInfo });

  // Nếu là bệnh nhân: chỉ hiển thị hồ sơ cá nhân
  if (user && user.role === 'patient') {
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSave = () => {
      setPatients(patients.map(p => (p.username === user.username || p.name === user.username) ? { ...p, ...form } : p));
      setEditMode(false);
    };
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h5" mb={2}>Hồ sơ cá nhân</Typography>
        {editMode ? (
          <>
            <TextField label="Họ tên" name="name" value={form.name || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Ngày sinh" name="dob" value={form.dob || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Giới tính" name="gender" value={form.gender || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Số điện thoại" name="phone" value={form.phone || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Địa chỉ" name="address" value={form.address || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>Lưu</Button>
            <Button onClick={() => setEditMode(false)}>Hủy</Button>
          </>
        ) : (
          <>
            <Typography><b>Họ tên:</b> {form.name}</Typography>
            <Typography><b>Ngày sinh:</b> {form.dob}</Typography>
            <Typography><b>Giới tính:</b> {form.gender}</Typography>
            <Typography><b>Số điện thoại:</b> {form.phone}</Typography>
            <Typography><b>Địa chỉ:</b> {form.address}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>Chỉnh sửa</Button>
          </>
        )}
      </Container>
    );
  }

  // Nếu không phải admin, có thể return null hoặc thông báo không có quyền truy cập
  if (!user || user.role !== 'admin') {
    return <Container maxWidth="sm" sx={{ mt: 6 }}><Typography>Bạn không có quyền truy cập chức năng này.</Typography></Container>;
  }

  const handleAdd = () => {
    setEditPatient(null);
    setShowForm(true);
  };
  const handleSelect = (patient) => {
    setSelectedPatient(patient);
  };
  const handleFormSubmit = (data) => {
    if (editPatient) {
      setPatients(patients.map(p => p.id === editPatient.id ? { ...p, ...data } : p));
      setSelectedPatient({ ...editPatient, ...data });
    } else {
      const newPatient = { ...data, id: patients.length + 1 };
      setPatients([...patients, newPatient]);
    }
    setShowForm(false);
    setEditPatient(null);
  };
  const handleEdit = () => {
    setEditPatient(selectedPatient);
    setShowForm(true);
  };
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.phone.includes(searchValue)
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Quản lý bệnh nhân</Typography>
      <PatientList
        patients={filteredPatients}
        onSelect={handleSelect}
        onAdd={handleAdd}
        onSearch={handleSearch}
        searchValue={searchValue}
      />
      <PatientForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditPatient(null); }}
        onSubmit={handleFormSubmit}
        initialData={editPatient}
      />
      <PatientDetail
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
        onEdit={handleEdit}
      />
    </Container>
  );
};

export default Patients;
