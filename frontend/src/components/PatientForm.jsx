import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const PatientForm = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Cập nhật thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Họ tên"
          type="text"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="dob"
          label="Ngày sinh"
          type="date"
          fullWidth
          value={form.dob}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          name="gender"
          label="Giới tính"
          select
          fullWidth
          value={form.gender}
          onChange={handleChange}
        >
          <MenuItem value="Nam">Nam</MenuItem>
          <MenuItem value="Nữ">Nữ</MenuItem>
          <MenuItem value="Khác">Khác</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          name="phone"
          label="Số điện thoại"
          type="text"
          fullWidth
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="address"
          label="Địa chỉ"
          type="text"
          fullWidth
          value={form.address}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Cập nhật' : 'Thêm mới'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientForm;
