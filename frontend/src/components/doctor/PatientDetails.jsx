import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  CalendarToday,
  AccessTime,
  Info,
  MedicalServices,
  History,
  Close,
  Warning,
  CheckCircle,
  Event
} from '@mui/icons-material';

const PatientDetails = ({ appointment, onClose, onStatusChange }) => {
  const [tabValue, setTabValue] = React.useState(0);
  
  if (!appointment) return null;
  
  const { 
    patientName, 
    phone, 
    email, 
    dob, 
    gender, 
    reason, 
    medicalHistory, 
    allergies, 
    notes,
    status,
    service,
    time
  } = appointment;
  
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : '';
  
  return (
    <Paper sx={{ 
      height: 'calc(100vh - 100px)',
      overflow: 'auto',
      position: 'sticky',
      top: 20,
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', position: 'relative' }}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'white', color: 'primary.main' }}>
            <Person fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">{patientName}</Typography>
            <Chip 
              label={status === 'confirmed' ? 'Đã xác nhận' : 
                     status === 'pending' ? 'Đang chờ' : 
                     status === 'completed' ? 'Đã khám' : 
                     status === 'cancelled' ? 'Đã hủy' : 'Đang khám'}
              size="small"
              sx={{ 
                bgcolor: status === 'confirmed' ? '#e3f2fd' : 
                               status === 'pending' ? '#fff3e0' :
                               status === 'completed' ? '#e8f5e9' :
                               status === 'cancelled' ? '#ffebee' : '#fff8e1',
                color: status === 'confirmed' ? '#1976d2' : 
                               status === 'pending' ? '#ef6c00' :
                               status === 'completed' ? '#2e7d32' :
                               status === 'cancelled' ? '#d32f2f' : '#ff8f00',
                fontWeight: 'bold',
                mt: 1
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{age} tuổi</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Info fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{gender === 'male' ? 'Nam' : 'Nữ'}</Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Thông tin khám" icon={<MedicalServices fontSize="small" />} iconPosition="start" />
          <Tab label="Tiền sử" icon={<History fontSize="small" />} iconPosition="start" />
        </Tabs>
        
        {tabValue === 0 ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                THÔNG TIN LỊCH HẸN
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><AccessTime fontSize="small" /></ListItemIcon>
                  <ListItemText 
                    primary="Thời gian khám" 
                    secondary={new Date(time).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><MedicalServices fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Dịch vụ" secondary={service} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Lý do khám" secondary={reason || 'Không có thông tin'} />
                </ListItem>
              </List>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                GHI CHÚ
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
                {notes || 'Không có ghi chú'}
              </Paper>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {status === 'confirmed' && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => onStatusChange('in_progress')}
                >
                  Bắt đầu khám
                </Button>
              )}
              
              {status === 'in_progress' && (
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => onStatusChange('completed')}
                >
                  Hoàn thành khám
                </Button>
              )}
              
              {status !== 'cancelled' && status !== 'completed' && (
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => onStatusChange('cancelled')}
                >
                  Hủy lịch hẹn
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                TIỀN SỬ BỆNH ÁN
              </Typography>
              {medicalHistory && medicalHistory.length > 0 ? (
                <List>
                  {medicalHistory.map((record, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon><Event fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary={record.diagnosis}
                          secondary={`${new Date(record.date).toLocaleDateString('vi-VN')} - Bác sĩ: ${record.doctor}`}
                        />
                      </ListItem>
                      {index < medicalHistory.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Không có thông tin tiền sử bệnh án
                </Typography>
              )}
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                DỊ ỨNG
              </Typography>
              {allergies && allergies.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allergies.map((allergy, index) => (
                    <Chip 
                      key={index} 
                      label={allergy} 
                      color="warning" 
                      size="small" 
                      icon={<Warning fontSize="small" />}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Không có thông tin dị ứng
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PatientDetails;
