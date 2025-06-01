import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Chip,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import { Close as CloseIcon, LocalHospital as HospitalIcon, EventNote as EventNoteIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `patient-tab-${index}`,
    'aria-controls': `patient-tabpanel-${index}`,
  };
}

const PatientDetails = ({ open, onClose, patient }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!patient) return null;

  // Dummy medical history data - replace with actual data from API
  const medicalHistory = [
    { id: 1, date: '2023-05-20', diagnosis: 'Cảm cúm', doctor: 'BS. Nguyễn Văn A', notes: 'Sốt nhẹ, đau họng' },
    { id: 2, date: '2023-04-15', diagnosis: 'Viêm họng cấp', doctor: 'BS. Trần Thị B', notes: 'Đau họng, khó nuốt' },
  ];

  // Dummy prescription history - replace with actual data from API
  const prescriptionHistory = [
    { id: 1, date: '2023-05-20', medicine: 'Paracetamol 500mg', dosage: '1 viên/lần, ngày 3 lần', duration: '5 ngày' },
    { id: 2, date: '2023-04-15', medicine: 'Amoxicillin 500mg', dosage: '1 viên/lần, ngày 2 lần', duration: '7 ngày' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Hồ sơ bệnh nhân</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="patient details tabs">
            <Tab label="Thông tin chung" {...a11yProps(0)} />
            <Tab label="Lịch sử khám bệnh" {...a11yProps(1)} />
            <Tab label="Đơn thuốc" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">Họ và tên</Typography>
              <Typography variant="body1" gutterBottom>{patient.name}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Giới tính</Typography>
              <Typography variant="body1" gutterBottom>{patient.gender}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Ngày sinh</Typography>
              <Typography variant="body1" gutterBottom>{patient.dob || 'Chưa cập nhật'}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Số điện thoại</Typography>
              <Typography variant="body1" gutterBottom>{patient.phone}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Email</Typography>
              <Typography variant="body1">{patient.email || 'Chưa cập nhật'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">Địa chỉ</Typography>
              <Typography variant="body1" gutterBottom>{patient.address || 'Chưa cập nhật'}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Số CMND/CCCD</Typography>
              <Typography variant="body1" gutterBottom>{patient.idCard || 'Chưa cập nhật'}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Số thẻ BHYT</Typography>
              <Typography variant="body1" gutterBottom>{patient.insuranceNumber || 'Chưa đăng ký'}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Người thân</Typography>
              <Typography variant="body1" gutterBottom>{patient.relativeName || 'Chưa cập nhật'}</Typography>
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>SĐT người thân</Typography>
              <Typography variant="body1">{patient.relativePhone || 'Chưa cập nhật'}</Typography>
            </Grid>
            

          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Chuẩn đoán</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalHistory.length > 0 ? (
                  medicalHistory.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày kê đơn</TableCell>
                  <TableCell>Thuốc</TableCell>
                  <TableCell>Liều lượng</TableCell>
                  <TableCell>Thời gian dùng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptionHistory.length > 0 ? (
                  prescriptionHistory.map((prescription) => (
                    <TableRow key={prescription.id} hover>
                      <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                      <TableCell>{prescription.medicine}</TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
        <Button variant="contained" color="primary">In hồ sơ</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetails;
