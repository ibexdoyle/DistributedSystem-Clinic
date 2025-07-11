// ✅ ĐÃ CẬP NHẬT: Gửi đúng request cho API http://localhost:8085/api/prescriptions

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, InputAdornment, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TablePagination
} from '@mui/material';
import {
  Search, Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';

const PrescriptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    diagnosis: '',
    symptoms: '',
    note: '',
    items: [
      { id: Date.now(), medicineName: '', dosage: '', instruction: '', price: 0 }
    ]
  });

  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      const decoded = jwtDecode(token);
      setDoctorName(decoded?.fullName || '');
      const email = decoded?.sub;

      fetch('http://localhost:8083/api/staffs')
        .then(res => res.json())
        .then(data => {
          const doc = data.find(s => s.email === email);
          if (doc) setDoctorId(doc.id);
        });
    }

    if (location.state?.patientId) {
      setPatientId(location.state.patientId);
    }
  }, [location]);

  const handleItemChange = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), medicineName: '', dosage: '', instruction: '', price: 0 }]
    }));
  };

  const handleRemoveItem = (id) => {
    if (form.items.length <= 1) return;
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !doctorId) return enqueueSnackbar('Thiếu thông tin bác sĩ hoặc bệnh nhân', { variant: 'error' });

    const payload = {
      patientId,
      doctorId,
      doctorName,
      diagnosis: form.diagnosis,
      symptoms: form.symptoms,
      note: form.note,
      totalPrice: form.items.reduce((sum, med) => sum + Number(med.price || 0), 0),
      items: form.items.map(med => ({
        medicineName: med.medicineName,
        dosage: med.dosage,
        instruction: med.instruction,
        price: Number(med.price || 0)
      }))
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8085/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Tạo đơn thuốc thất bại');
      enqueueSnackbar('Tạo đơn thuốc thành công!', { variant: 'success' });
      navigate('/doctor/prescriptions');
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ my: 2 }}>Kê đơn thuốc</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Chẩn đoán"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          fullWidth margin="normal" required
        />
        <TextField
          label="Triệu chứng"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          fullWidth margin="normal" required
        />
        <TextField
          label="Ghi chú"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          fullWidth margin="normal" multiline rows={2}
        />

        {form.items.map((item, index) => (
          <Box key={item.id} sx={{ my: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="subtitle2">Thuốc #{index + 1}</Typography>
            <TextField
              label="Tên thuốc"
              value={item.medicineName}
              onChange={(e) => handleItemChange(item.id, 'medicineName', e.target.value)}
              fullWidth margin="dense" required
            />
            <TextField
              label="Liều dùng"
              value={item.dosage}
              onChange={(e) => handleItemChange(item.id, 'dosage', e.target.value)}
              fullWidth margin="dense" required
            />
            <TextField
              label="Hướng dẫn sử dụng"
              value={item.instruction}
              onChange={(e) => handleItemChange(item.id, 'instruction', e.target.value)}
              fullWidth margin="dense" required
            />
            <TextField
              label="Giá tiền"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
              fullWidth margin="dense"
            />
            <Button color="error" onClick={() => handleRemoveItem(item.id)} sx={{ mt: 1 }}>
              Xóa thuốc
            </Button>
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddItem}>
          Thêm thuốc
        </Button>

        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu đơn thuốc'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PrescriptionForm;