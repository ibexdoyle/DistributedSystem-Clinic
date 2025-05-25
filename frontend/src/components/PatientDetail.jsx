import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';

const PatientDetail = ({ open, onClose, patient, onEdit, onViewHistory }) => {
  if (!patient) return null;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thông tin bệnh nhân</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography><b>Họ tên:</b> {patient.name}</Typography>
          <Typography><b>Ngày sinh:</b> {patient.dob}</Typography>
          <Typography><b>Giới tính:</b> {patient.gender}</Typography>
          <Typography><b>Số điện thoại:</b> {patient.phone}</Typography>
          <Typography><b>Địa chỉ:</b> {patient.address}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onEdit}>Chỉnh sửa</Button>
        <Button onClick={onViewHistory}>Lịch sử khám</Button>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetail;
