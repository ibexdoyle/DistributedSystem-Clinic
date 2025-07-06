import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Dummy data for medicines - in a real app, this would come from an API
const dummyMedicines = [
  { id: 1, name: 'Paracetamol 500mg', unit: 'Viên' },
  { id: 2, name: 'Amoxicillin 500mg', unit: 'Viên' },
  { id: 3, name: 'Panadol Extra', unit: 'Viên' },
  { id: 4, name: 'Efferalgan 500mg', unit: 'Viên' },
  { id: 5, name: 'Tiffy', unit: 'Viên' },
];

const PrescriptionForm = ({ open, onClose, patient, onSubmit }) => {
  const [medicines, setMedicines] = useState([{ id: Date.now(), medicineId: '', quantity: 1, dosage: '1 viên/lần, ngày 2 lần', note: '' }]);
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');

  const handleAddMedicine = () => {
    setMedicines([...medicines, { id: Date.now() + Math.random(), medicineId: '', quantity: 1, dosage: '', note: '' }]);
  };

  const handleRemoveMedicine = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const handleMedicineChange = (id, field, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    console.log('Submitting prescription:', {
      patientId: patient.id,
      diagnosis,
      medicines: medicines.filter(m => m.medicineId),
      note,
      date: new Date().toISOString()
    });

    // Show success message
    alert('Tạo đơn thuốc thành công!');
    
    // Reset form
    setMedicines([{ id: Date.now(), medicineId: '', quantity: 1, dosage: '', note: '' }]);
    setDiagnosis('');
    setNote('');
    
    // Close the form
    onClose();
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tạo đơn thuốc mới</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">
          Bệnh nhân: {patient?.name}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Chuẩn đoán"
                fullWidth
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">Danh sách thuốc</Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={handleAddMedicine}
                >
                  Thêm thuốc
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="40%">Tên thuốc</TableCell>
                      <TableCell width="20%">Số lượng</TableCell>
                      <TableCell width="30%">Liều dùng</TableCell>
                      <TableCell width="10%" align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicines.map((medicine, index) => (
                      <TableRow key={medicine.id}>
                        <TableCell>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            value={medicine.medicineId}
                            onChange={(e) => handleMedicineChange(medicine.id, 'medicineId', e.target.value)}
                            required
                          >
                            <MenuItem value="">
                              <em>Chọn thuốc</em>
                            </MenuItem>
                            {dummyMedicines.map((med) => (
                              <MenuItem key={med.id} value={med.id}>
                                {med.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            value={medicine.quantity}
                            onChange={(e) => handleMedicineChange(medicine.id, 'quantity', e.target.value)}
                            required
                            inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(medicine.id, 'dosage', e.target.value)}
                            placeholder="VD: 1 viên/lần, ngày 2 lần"
                            required
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveMedicine(medicine.id)}
                            disabled={medicines.length <= 1}
                          >
                            <DeleteIcon fontSize="small" color={medicines.length > 1 ? 'error' : 'disabled'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            Lưu đơn thuốc
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PrescriptionForm;
