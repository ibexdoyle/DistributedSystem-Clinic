import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PatientHistory = ({ open, onClose, history }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lịch sử khám chữa bệnh</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày khám</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.doctor}</TableCell>
                  <TableCell>{item.diagnosis}</TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistory;
