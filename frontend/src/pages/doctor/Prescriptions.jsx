import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
  Divider,
  Grid
} from '@mui/material';
import { 
  Search, 
  Add as AddIcon, 
  Edit, 
  Visibility,
  Close,
  LocalPharmacy,
  Print as PrintIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const PrescriptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  
  // Check if in create new prescription mode
  const isCreateMode = location.pathname.endsWith('/new');
  
  // Get patient data from location state if available
  const [currentPatient, setCurrentPatient] = useState({
    id: patientId || 'P001',
    name: 'Nguyễn Văn A',
    age: 35,
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0987654321',
  });
  

  
  // Initialize form when in create mode or patient data changes
  useEffect(() => {
    if (location.state?.patient) {
      const patientData = location.state.patient;
      // Completely replace the current patient data with the new one
      setCurrentPatient(patientData);
      
      // If viewing an existing prescription, update the patient data in the form
      if (patientData.id) {
        setSelectedPrescription(prev => ({
          ...prev,
          patientName: patientData.name
        }));
      }
    }
    
    // If in create mode, open the form
    if (isCreateMode) {
      setOpenDialog(true);
    }
  }, [location.state, isCreateMode]);
  // Mock prescriptions data
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      date: '2025-06-10T10:30:00',
      status: 'completed',
      diagnosis: 'Viêm họng cấp',
      note: 'Uống thuốc đúng giờ, tái khám sau 1 tuần nếu không đỡ',
      medicines: [
        { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: '2 lần/ngày', duration: '5 ngày' },
        { id: 2, name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '7 ngày' }
      ]
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Trần Thị B',
      patientAge: 40,
      patientGender: 'Nữ',
      email: 'tranthib@example.com',
      date: '2025-06-09T14:15:00',
      status: 'completed',
      diagnosis: 'Cảm cúm',
      note: 'Nghỉ ngơi nhiều, uống đủ nước',
      medicines: [
        { id: 3, name: 'Tiffy', dosage: '1 viên', frequency: '3 lần/ngày', duration: '3 ngày' }
      ]
    }
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState({
    id: null,
    patientName: '',
    diagnosis: '',
    medicines: [],
    status: 'pending'
  });
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');

  // Format date to Vietnamese locale
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd 'tháng' MM 'năm' yyyy", { locale: vi });
  };

  const handleCreatePrescription = () => {
    setSelectedPrescription({
      id: null,
      patientName: currentPatient.name,
      diagnosis: '',
      medicines: [],
      status: 'pending'
    });
    setDiagnosis('');
    setNote('');
    setNewMedicine({ name: '', dosage: '', frequency: '', duration: '' });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleViewPrescription = (prescription, editMode = false) => {
    // Find the patient data for this prescription
    const patientPrescription = prescriptions.find(p => p.id === prescription.id);
    
    // Update the current patient with the prescription's patient data
    if (patientPrescription) {
      setCurrentPatient({
        ...currentPatient,
        name: patientPrescription.patientName,
        // Keep other patient data if available, otherwise use defaults
        age: patientPrescription.patientAge || currentPatient.age,
        gender: patientPrescription.patientGender || currentPatient.gender
      });
    }
    
    setSelectedPrescription({
      ...prescription,
      patientName: patientPrescription?.patientName || prescription.patientName,
      medicines: prescription.medicines?.length > 0 
        ? prescription.medicines 
        : [{ id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }]
    });
    
    setDiagnosis(prescription.diagnosis || '');
    setNote(prescription.note || '');
    setIsEditMode(editMode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrescription(null);
    setIsEditMode(false);
  };

  const handleOpenDeleteDialog = (prescription) => {
    setPrescriptionToDelete(prescription);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPrescriptionToDelete(null);
  };

  const handleDeletePrescription = () => {
    if (prescriptionToDelete) {
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionToDelete.id));
      enqueueSnackbar('Xóa đơn thuốc thành công', { variant: 'success' });
      handleCloseDeleteDialog();
    }
  };

  const handleSavePrescription = async () => {
    try {
      // In view mode, just close the dialog
      if (!isEditMode) {
        setOpenDialog(false);
        return;
      }

      // In edit mode, validate and save
      if (!selectedPrescription?.patientName || !diagnosis) {
        enqueueSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc', { variant: 'error' });
        return;
      }

      if (selectedPrescription.medicines.length === 0) {
        enqueueSnackbar('Vui lòng thêm ít nhất một loại thuốc', { variant: 'warning' });
        return;
      }

      const newPrescription = {
        id: selectedPrescription?.id || Date.now(),
        patientId: currentPatient.id,
        patientName: selectedPrescription.patientName,
        date: new Date().toISOString(),
        status: 'completed',
        diagnosis,
        note,
        medicines: selectedPrescription.medicines.filter(med => med.name.trim() !== '')
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (selectedPrescription?.id) {
        // Update existing prescription
        const updatedPrescriptions = prescriptions.map(p => 
          p.id === selectedPrescription.id ? newPrescription : p
        );
        setPrescriptions(updatedPrescriptions);
        enqueueSnackbar('Cập nhật đơn thuốc thành công', { variant: 'success' });
      } else {
        // Add new prescription
        setPrescriptions([newPrescription, ...prescriptions]);
        enqueueSnackbar('Tạo đơn thuốc thành công', { variant: 'success' });
      }
      
      setOpenDialog(false);
      setSelectedPrescription(null);
      setIsEditMode(false);
      
      // If in create mode, navigate back to prescriptions list
      if (isCreateMode) {
        navigate('/doctor/prescriptions');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      enqueueSnackbar('Đã có lỗi xảy ra khi lưu đơn thuốc', { variant: 'error' });
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.duration) {
      setSelectedPrescription(prev => ({
        ...prev,
        medicines: [...(prev.medicines || []), { ...newMedicine, id: Date.now() }]
      }));
      setNewMedicine({ name: '', dosage: '', frequency: '', duration: '' });
    }
  };

  const handleRemoveMedicine = (id) => {
    const updatedMedicines = selectedPrescription.medicines.filter(med => med.id !== id);
    setSelectedPrescription(prev => ({
      ...prev,
      medicines: updatedMedicines
    }));
  };

  const handleMedicineChange = (id, field, value) => {
    setSelectedPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle form submission
    console.log('Form submitted', {
      patientId: currentPatient.id,
      diagnosis,
      note,
      medicines: selectedPrescription?.medicines || []
    });
    
    // If in create mode, navigate back to prescriptions list after submission
    if (isCreateMode) {
      navigate('/doctor/prescriptions');
    } else {
      handleCloseDialog();
    }
  };

  const handleOpenForm = () => {
    // If not in create mode, navigate to new prescription form
    if (!isCreateMode) {
      navigate('/doctor/prescriptions/new', { state: { patient: currentPatient } });
      return;
    }
    window.print();
  };

  useEffect(() => {
    if (isCreateMode) {
      const patient = location.state?.patient;
      if (patient) {
        setSelectedPrescription({
          id: null,
          patientName: patient.name,
          diagnosis: '',
          medicines: [],
          status: 'pending'
        });
        setDiagnosis('');
        setNote('');
        setNewMedicine({ name: '', dosage: '', frequency: '', duration: '' });
        setOpenDialog(true);
      }
    }
  }, [isCreateMode, location.state]);

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          <LocalPharmacy sx={{ verticalAlign: 'middle', mr: 1 }} />
          Quản lý đơn thuốc
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm đơn thuốc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePrescription}
          >
            Tạo đơn thuốc
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.length > 0 ? (
                prescriptions
                  .filter(pres => 
                    pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pres.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((pres) => (
                    <TableRow key={pres.id} hover>
                      <TableCell>#{pres.id}</TableCell>
                      <TableCell>{pres.patientName}</TableCell>
                      <TableCell>
                        {format(new Date(pres.date), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{pres.diagnosis || '--'}</TableCell>
                      <TableCell>
                        {pres.medicines.length} loại
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPrescription(pres, true);
                          }}
                          title="Chỉnh sửa đơn thuốc"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteDialog(pres);
                          }}
                          title="Xóa đơn thuốc"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Chưa có đơn thuốc nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Xác nhận xóa đơn thuốc */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đơn thuốc này không?</Typography>
          {prescriptionToDelete && (
            <Box mt={2}>
              <Typography variant="subtitle2">Mã đơn: #{prescriptionToDelete.id}</Typography>
              <Typography variant="body2">Bệnh nhân: {prescriptionToDelete.patientName}</Typography>
              <Typography variant="body2">Chẩn đoán: {prescriptionToDelete.diagnosis || '--'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleDeletePrescription} 
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo/xem đơn thuốc */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? (selectedPrescription?.id ? 'Chỉnh sửa đơn thuốc' : 'Tạo đơn thuốc mới') : 'Chi tiết đơn thuốc'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Thông tin bệnh nhân
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Họ tên bệnh nhân"
                size="small"
                fullWidth
                value={selectedPrescription?.patientName || ''}
                onChange={(e) => setSelectedPrescription({
                  ...selectedPrescription,
                  patientName: e.target.value
                })}
              />
              <TextField
                label="Tuổi"
                size="small"
                value={currentPatient?.age ? `${currentPatient.age} tuổi` : ''}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '120px' }}
              />
              <TextField
                label="Giới tính"
                size="small"
                value={currentPatient?.gender || ''}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ minWidth: '100px' }}
              />
            </Box>
            
            <TextField
              label="Chẩn đoán"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={selectedPrescription?.diagnosis || ''}
              onChange={(e) => setSelectedPrescription({
                ...selectedPrescription,
                diagnosis: e.target.value
              })}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Danh sách thuốc
            </Typography>
            
            <Box sx={{ mb: 2, p: 2, border: '1px dashed #ddd', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Tên thuốc"
                  size="small"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                />
                <TextField
                  label="Liều dùng"
                  size="small"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                />
                <TextField
                  label="Số lần/ngày"
                  size="small"
                  value={newMedicine.frequency}
                  onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                />
                <TextField
                  label="Số ngày dùng"
                  size="small"
                  value={newMedicine.duration}
                  onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddMedicine}
                  disabled={!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency || !newMedicine.duration}
                >
                  Thêm
                </Button>
              </Box>
              
              {selectedPrescription?.medicines?.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thuốc</TableCell>
                        <TableCell>Liều dùng</TableCell>
                        <TableCell>Số lần/ngày</TableCell>
                        <TableCell>Số ngày</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPrescription.medicines.map((med, index) => (
                        <TableRow key={med.id || index}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.duration}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveMedicine(med.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
            
            <TextField
              label="Ghi chú"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={selectedPrescription?.note || ''}
              onChange={(e) => setSelectedPrescription({
                ...selectedPrescription,
                note: e.target.value
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSavePrescription}
            disabled={!selectedPrescription?.patientName || !selectedPrescription?.diagnosis}
          >
            Lưu đơn thuốc
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrescriptionsPage;
