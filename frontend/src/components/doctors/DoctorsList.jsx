import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import staffService from '../../services/staffService';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách bác sĩ
        const doctorsRes = await staffService.getDoctors();
        if (!doctorsRes.success) {
          throw new Error(doctorsRes.message);
        }
        setDoctors(doctorsRes.data);
        setFilteredDoctors(doctorsRes.data);

        // Lấy danh sách chuyên khoa
        const specsRes = await staffService.getSpecializations();
        if (specsRes.success) {
          setSpecializations(specsRes.data);
        }
        
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc bác sĩ theo chuyên khoa
  useEffect(() => {
    if (selectedSpecialization === 'all') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        doctor => doctor.specialization === selectedSpecialization
      );
      setFilteredDoctors(filtered);
    }
  }, [selectedSpecialization, doctors]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Đội Ngũ Bác Sĩ
      </Typography>
      
      {/* Bộ lọc chuyên khoa */}
      <Box sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        <FormControl fullWidth>
          <InputLabel id="specialization-select-label">Chuyên khoa</InputLabel>
          <Select
            labelId="specialization-select-label"
            id="specialization-select"
            value={selectedSpecialization}
            label="Chuyên khoa"
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <MenuItem value="all">Tất cả chuyên khoa</MenuItem>
            {specializations.map((spec, index) => (
              <MenuItem key={index} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Danh sách bác sĩ */}
      {filteredDoctors.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          Không tìm thấy bác sĩ nào.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredDoctors.map((doctor) => (
            <Grid item key={doctor.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={doctor.avatar || '/default-avatar.jpg'}
                  alt={doctor.fullName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {doctor.title || 'Bác sĩ'} {doctor.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                  {doctor.experience && (
                    <Typography variant="body2" color="text.secondary">
                      Kinh nghiệm: {doctor.experience} năm
                    </Typography>
                  )}
                  {doctor.education && (
                    <Typography variant="body2" color="text.secondary">
                      Học vấn: {doctor.education}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DoctorsList;
