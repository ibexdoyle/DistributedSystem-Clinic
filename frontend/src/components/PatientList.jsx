import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField } from '@mui/material';

const PatientList = ({ patients, onSelect, onAdd, onSearch, searchValue }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Danh sách bệnh nhân</Typography>
      <TextField
        label="Tìm kiếm bệnh nhân"
        variant="outlined"
        value={searchValue}
        onChange={e => onSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={onAdd} sx={{ mb: 2 }}>
        Thêm bệnh nhân mới
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => onSelect(patient)}>Xem chi tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PatientList;
