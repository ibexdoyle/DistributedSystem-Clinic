import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

const AppointmentActions = ({ 
  open, 
  onClose, 
  appointment,
  onStatusChange,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    doctor: appointment?.doctor || '',
    service: appointment?.service || '',
    date: appointment?.date ? new Date(appointment.date) : new Date(),
    note: appointment?.note || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(appointment.id, editedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({
      doctor: appointment?.doctor || '',
      service: appointment?.service || '',
      date: appointment?.date ? new Date(appointment.date) : new Date(),
      note: appointment?.note || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setEditedData(prev => ({
      ...prev,
      date
    }));
  };

  if (!appointment) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chi tiết lịch hẹn</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">Thông tin bệnh nhân</Typography>
          <Typography>Họ tên: {appointment.patientName}</Typography>
          <Typography>SĐT: {appointment.phone}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {isEditing ? (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Chỉnh sửa thông tin
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DateTimePicker
                label="Thời gian hẹn"
                value={editedData.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Bác sĩ</InputLabel>
              <Select
                name="doctor"
                value={editedData.doctor}
                label="Bác sĩ"
                onChange={handleInputChange}
              >
                <MenuItem value="BS. Trần Thị B">BS. Trần Thị B</MenuItem>
                <MenuItem value="BS. Lê Văn D">BS. Lê Văn D</MenuItem>
                <MenuItem value="BS. Nguyễn Văn F">BS. Nguyễn Văn F</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Dịch vụ</InputLabel>
              <Select
                name="service"
                value={editedData.service}
                label="Dịch vụ"
                onChange={handleInputChange}
              >
                <MenuItem value="Khám tổng quát">Khám tổng quát</MenuItem>
                <MenuItem value="Điều trị nội khoa">Điều trị nội khoa</MenuItem>
                <MenuItem value="Vật lý trị liệu">Vật lý trị liệu</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              label="Ghi chú"
              name="note"
              value={editedData.note}
              onChange={handleInputChange}
              multiline
              rows={3}
              size="small"
            />
            
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button 
                variant="outlined" 
                onClick={handleCancelEdit}
                color="inherit"
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                color="primary"
              >
                Lưu thay đổi
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Thông tin lịch hẹn</Typography>
            <Typography>Bác sĩ: {appointment.doctor}</Typography>
            <Typography>Dịch vụ: {appointment.service}</Typography>
            <Typography>
              Thời gian: {format(parseISO(appointment.date), 'HH:mm dd/MM/yyyy', { locale: vi })}
            </Typography>
            <Typography>Ghi chú: {appointment.note || 'Không có'}</Typography>
            
            <Box mt={3}>
              <Stack direction="row" spacing={1}>
                {appointment.status === 'pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => onStatusChange(appointment.id, 'confirmed')}
                      fullWidth
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => onStatusChange(appointment.id, 'cancelled')}
                      fullWidth
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                
                {appointment.status === 'confirmed' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onStatusChange(appointment.id, 'completed')}
                    fullWidth
                  >
                    Đánh dấu đã hoàn thành
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  fullWidth
                >
                  Chỉnh sửa
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentActions;
