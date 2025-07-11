import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Box, TextField, Dialog,
  DialogTitle, DialogContent, List, ListItem, ListItemText
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MedicalRecordsPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:8082/api/patients');
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách bệnh nhân:', err);
      }
    };
    fetchPatients();
  }, []);

  const handleViewDetail = async (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);

    try {
      const res = await fetch(`http://localhost:8085/api/prescriptions?patientId=${patient.id}`);
      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử khám:', err);
      setPrescriptions([]);
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Quản lý hồ sơ bệnh án</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm theo tên, mã BN hoặc số điện thoại (tạm thời không dùng)"
          disabled
        />
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã BN</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{patient.dob}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phoneNumber}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetail(patient)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {patients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">Không có bệnh nhân nào</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Thông tin bệnh nhân</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <>
              <Typography variant="subtitle1"><strong>Họ tên:</strong> {selectedPatient.fullName}</Typography>
              <Typography variant="subtitle1"><strong>Ngày sinh:</strong> {selectedPatient.dob}</Typography>
              <Typography variant="subtitle1"><strong>Giới tính:</strong> {selectedPatient.gender}</Typography>
              <Typography variant="subtitle1"><strong>Số điện thoại:</strong> {selectedPatient.phoneNumber}</Typography>
              <Typography variant="subtitle1"><strong>Địa chỉ:</strong> {selectedPatient.address}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Lịch sử khám</Typography>
              {prescriptions.length > 0 ? (
                <List>
                  {prescriptions.map((p) => (
                    <ListItem key={p.id} alignItems="flex-start" divider>
                      <ListItemText
                        primary={`🗓 Ngày khám: ${new Date(p.createdAt).toLocaleDateString('vi-VN')}`}
                        secondary={
                          <>
                            <Typography><strong>Bác sĩ:</strong> {p.doctorName}</Typography>
                            <Typography><strong>Chẩn đoán:</strong> {p.diagnosis}</Typography>
                            <Typography><strong>Triệu chứng:</strong> {p.symptoms}</Typography>
                            <Typography><strong>Ghi chú:</strong> {p.note}</Typography>
                            <Typography><strong>Tổng tiền:</strong> {p.totalPrice.toLocaleString('vi-VN')} đ</Typography>
                            {p.items?.length > 0 && (
                              <>
                                <Typography sx={{ mt: 1 }}><strong>💊 Thuốc kê:</strong></Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                  {p.items.map((item, idx) => (
                                    <li key={idx}>
                                      <strong>{item.medicineName}</strong> - {item.dosage} - {item.instruction}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <PrescriptionForm patient={selectedPatient} onSaved={() => setOpenDialog(false)} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const PrescriptionForm = ({ patient, onSaved }) => {
  const [form, setForm] = useState({
    diagnosis: '',
    symptoms: '',
    note: '',
    items: [
      { medicineName: '', dosage: '', instruction: '', price: 0 }
    ]
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { medicineName: '', dosage: '', instruction: '', price: 0 }]
    }));
  };

  const handleSubmit = async () => {
    try {
      const doctorName = 'Bác sĩ A';
      const doctorId = 1;
      const totalPrice = form.items.reduce((sum, item) => sum + Number(item.price || 0), 0);

      const body = {
        patientId: patient.id,
        doctorId,
        doctorName,
        diagnosis: form.diagnosis,
        symptoms: form.symptoms,
        note: form.note,
        totalPrice,
        items: form.items
      };

      await fetch('http://localhost:8085/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      alert('Đã lưu đơn thuốc!');
      onSaved();
    } catch (err) {
      alert('Lỗi khi lưu đơn thuốc');
      console.error(err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>📝 Tạo mới đơn thuốc</Typography>

      <TextField label="Chẩn đoán" fullWidth margin="normal"
        value={form.diagnosis} onChange={(e) => handleChange('diagnosis', e.target.value)} />
      <TextField label="Triệu chứng" fullWidth margin="normal"
        value={form.symptoms} onChange={(e) => handleChange('symptoms', e.target.value)} />
      <TextField label="Ghi chú" fullWidth margin="normal"
        value={form.note} onChange={(e) => handleChange('note', e.target.value)} />

      <Typography variant="subtitle2" sx={{ mt: 2 }}>💊 Thuốc kê</Typography>
      {form.items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField label="Tên thuốc" value={item.medicineName} onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)} />
          <TextField label="Liều dùng" value={item.dosage} onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)} />
          <TextField label="Hướng dẫn" value={item.instruction} onChange={(e) => handleItemChange(idx, 'instruction', e.target.value)} />
          <TextField label="Giá" type="number" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} />
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <button onClick={addMedicine}>➕ Thêm thuốc</button>
        <button onClick={handleSubmit} style={{ marginLeft: 16 }}>💾 Lưu đơn thuốc</button>
      </Box>
    </Box>
  );
};

export default MedicalRecordsPage;