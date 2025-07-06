import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Typography,
  Paper, InputAdornment, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// Mock data for medicines
const mockMedicines = [
  { id: 1, name: 'Paracetamol', type: 'Giảm đau', unit: 'Viên', price: 500, stock: 1000, description: 'Thuốc giảm đau, hạ sốt' },
  { id: 2, name: 'Amoxicillin', type: 'Kháng sinh', unit: 'Viên', price: 2000, stock: 500, description: 'Kháng sinh điều trị nhiễm khuẩn' },
  { id: 3, name: 'Oresol', type: 'Bù nước', unit: 'Gói', price: 3000, stock: 300, description: 'Bù nước và điện giải' },
  { id: 4, name: 'Panadol', type: 'Giảm đau', unit: 'Viên', price: 800, stock: 800, description: 'Giảm đau, hạ sốt' },
  { id: 5, name: 'Cephalexin', type: 'Kháng sinh', unit: 'Viên', price: 2500, stock: 400, description: 'Kháng sinh phổ rộng' },
];

const medicineTypes = ['Tất cả', 'Giảm đau', 'Kháng sinh', 'Bù nước', 'Khác'];

const Medicines = () => {
  console.log('Medicines component is rendering');
  const { enqueueSnackbar } = useSnackbar();
  const [medicines, setMedicines] = useState(mockMedicines);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    unit: '',
    price: '',
    stock: '',
    description: ''
  });

  // Filter medicines based on search term and selected type
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tất cả' || medicine.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenAddDialog = () => {
    setCurrentMedicine(null);
    setFormData({
      name: '',
      type: '',
      unit: '',
      price: '',
      stock: '',
      description: ''
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (medicine) => {
    setCurrentMedicine(medicine);
    setFormData({
      name: medicine.name,
      type: medicine.type,
      unit: medicine.unit,
      price: medicine.price,
      stock: medicine.stock,
      description: medicine.description
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMedicine(null);
  };

  const handleSaveMedicine = () => {
    if (isEditing) {
      const updatedMedicines = medicines.map(med => 
        med.id === currentMedicine.id ? { ...formData, id: currentMedicine.id } : med
      );
      setMedicines(updatedMedicines);
      enqueueSnackbar('Cập nhật thuốc thành công!', { variant: 'success' });
    } else {
      const newMedicine = {
        ...formData,
        id: Math.max(...medicines.map(m => m.id), 0) + 1
      };
      setMedicines([...medicines, newMedicine]);
      enqueueSnackbar('Thêm thuốc mới thành công!', { variant: 'success' });
    }
    setOpenDialog(false);
  };

  const handleDeleteMedicine = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      const updatedMedicines = medicines.filter(med => med.id !== id);
      setMedicines(updatedMedicines);
      enqueueSnackbar('Đã xóa thuốc thành công!', { variant: 'success' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý Thuốc
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Thêm thuốc mới
        </Button>
      </Box>

      {/* Search and filter bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm thuốc..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Loại thuốc</InputLabel>
          <Select
            value={selectedType}
            label="Loại thuốc"
            onChange={handleTypeChange}
          >
            {medicineTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Medicines table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Giá (VNĐ)</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((medicine, index) => (
                  <TableRow key={medicine.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.type}</TableCell>
                    <TableCell>{medicine.unit}</TableCell>
                    <TableCell>{medicine.price.toLocaleString()}</TableCell>
                    <TableCell>{medicine.stock}</TableCell>
                    <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {medicine.description}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEditDialog(medicine)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteMedicine(medicine.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMedicines.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong số ${count}`}
        />
      </Paper>

      {/* Add/Edit Medicine Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Chỉnh sửa thông tin thuốc' : 'Thêm thuốc mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="name"
              label="Tên thuốc"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Loại thuốc</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Loại thuốc"
                onChange={handleInputChange}
              >
                {medicineTypes.filter(type => type !== 'Tất cả').map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="unit"
                label="Đơn vị tính"
                value={formData.unit}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="price"
                label="Giá (VNĐ)"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="stock"
                label="Số lượng tồn"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>
            <TextField
              name="description"
              label="Mô tả"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            onClick={handleSaveMedicine} 
            variant="contained"
            disabled={!formData.name || !formData.type || !formData.unit || !formData.price || formData.stock === ''}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Medicines;
