import React, { useState, useEffect } from 'react';
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
import {
  getAllMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine
} from '../../services/medicineService';

const medicineTypes = ['Tất cả', 'Giảm đau', 'Kháng sinh', 'Bù nước', 'Khác'];

const Medicines = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [medicines, setMedicines] = useState([]);
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
    description: '',
    expiryDate: '',
    provider: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await getAllMedicines();
      setMedicines(res.data);
    } catch (error) {
      enqueueSnackbar('Lỗi khi tải dữ liệu thuốc!', { variant: 'error' });
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (medicine.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'Tất cả' || medicine.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
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
      description: '',
      expiryDate: '',
      provider: ''
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (medicine) => {
    setCurrentMedicine(medicine);
    setFormData({
      name: medicine.name || '',
      type: medicine.type || '',
      unit: medicine.unit || '',
      price: medicine.price || '',
      stock: medicine.stockQuantity || '',
      description: medicine.description || '',
      expiryDate: medicine.expiryDate || '',
      provider: medicine.provider || ''
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMedicine(null);
  };

  const handleSaveMedicine = async () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      unit: formData.unit,
      stockQuantity: parseInt(formData.stock),
      expiryDate: formData.expiryDate,
      price: parseFloat(formData.price),
      provider: formData.provider
    };

    try {
      if (isEditing) {
        await updateMedicine(currentMedicine.id, payload);
        enqueueSnackbar('Cập nhật thuốc thành công!', { variant: 'success' });
      } else {
        await createMedicine(payload);
        enqueueSnackbar('Thêm thuốc mới thành công!', { variant: 'success' });
      }
      fetchMedicines();
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar('Lỗi khi lưu thuốc!', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      try {
        await deleteMedicine(id);
        enqueueSnackbar('Đã xóa thuốc thành công!', { variant: 'success' });
        fetchMedicines();
      } catch (error) {
        enqueueSnackbar('Lỗi khi xóa thuốc!', { variant: 'error' });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Thuốc</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
          Thêm thuốc mới
        </Button>
      </Box>

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
            )
          }}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Loại thuốc</InputLabel>
          <Select value={selectedType} label="Loại thuốc" onChange={handleTypeChange}>
            {medicineTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Nhà cung cấp</TableCell>
                <TableCell>Hạn sử dụng</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((medicine, index) => (
                <TableRow key={medicine.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.unit}</TableCell>
                  <TableCell>{medicine.price?.toLocaleString()}</TableCell>
                  <TableCell>{medicine.stockQuantity}</TableCell>
                  <TableCell>{medicine.provider}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(medicine)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(medicine.id)} color="error"><DeleteIcon /></IconButton>
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
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Tên thuốc" name="name" value={formData.name} onChange={handleInputChange} required fullWidth />
            <TextField label="Loại" name="type" value={formData.type} onChange={handleInputChange} fullWidth />
            <TextField label="Đơn vị" name="unit" value={formData.unit} onChange={handleInputChange} fullWidth />
            <TextField label="Giá (VNĐ)" name="price" type="number" value={formData.price} onChange={handleInputChange} fullWidth />
            <TextField label="Tồn kho" name="stock" type="number" value={formData.stock} onChange={handleInputChange} fullWidth />
            <TextField label="Nhà cung cấp" name="provider" value={formData.provider} onChange={handleInputChange} fullWidth />
            <TextField label="Hạn sử dụng" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveMedicine}
            disabled={!formData.name || !formData.unit || !formData.price || formData.stock === ''}
            variant="contained"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Medicines;
