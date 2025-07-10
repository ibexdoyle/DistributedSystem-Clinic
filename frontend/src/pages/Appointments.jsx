import React, { useState, useEffect } from 'react';
import { addAppointment, getAllAppointments } from '../mock/appointmentsDB';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  InputAdornment, 
  Alert, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  Select, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Divider,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocalHospital as LocalHospitalIcon,
  CalendarMonth as CalendarMonthIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
  Wc as GenderIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        gender: '',
        department: '',
        doctor: '',
        date: '',
        time: '',
        note: ''
    });
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientExists, setPatientExists] = useState(false);
    const [patientInfo, setPatientInfo] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    // State cho danh sách lịch hẹn
    const [appointments, setAppointments] = useState([]);

    // Fetch doctors and extract departments
    useEffect(() => {
        fetch('http://localhost:8083/api/staffs')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                const doctorList = Array.isArray(data) ? data.filter(staff => staff.staffRole === 'DOCTOR' && staff.isActive) : [];
                setDoctors(doctorList.map(d => ({
                    id: d.id,
                    name: d.fullName,
                    department: d.department
                })));
                // Unique department list
                const deptMap = {};
                doctorList.forEach(d => {
                    if (d.department && !deptMap[d.department]) {
                        deptMap[d.department] = true;
                    }
                });
                setDepartments(Object.keys(deptMap).map(dep => ({ id: dep, name: dep })));
            })
            .catch(() => {
                setDoctors([]);
                setDepartments([]);
            });
    }, []);

    // Fetch danh sách lịch hẹn khi vào trang
    useEffect(() => {
        fetch('http://localhost:8084/api/appointments')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                // Nếu trả về object đơn lẻ thì chuyển thành mảng
                setAppointments(Array.isArray(data) ? data : [data]);
            })
            .catch(() => setAppointments([]));
    }, []);

    // Filter doctors based on selected department
    const filteredDoctors = form.department ?
        doctors.filter(doctor => doctor.department === form.department) :
        [];

    // Kiểm tra patient theo email user khi vào trang (chỉ chạy 1 lần)
    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:8082/api/patients?email=${encodeURIComponent(user.email)}`, {
                headers: { 'x-user-id': user.email }
            })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setPatientExists(true);
                    setPatientInfo(data[0]);
                    setForm(f => ({
                        ...f,
                        name: data[0].fullName || '',
                        phone: data[0].phoneNumber || '',
                        gender: data[0].gender || ''
                    }));
                } else {
                    setPatientExists(false);
                }
            })
            .catch(() => setPatientExists(false));
        }
    }, [user]);

    // Auto-clear error messages after 3 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Add this new useEffect to auto-clear success messages after 3 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = e => {
        const { name, value } = e.target;

        // If department changes, reset doctor selection
        if (name === 'department') {
            setForm(prev => ({
                ...prev,
                [name]: value,
                doctor: ''
            }));
        }
        // Reset time if date changes
        else if (name === 'date') {
            setForm(prev => ({
                ...prev,
                [name]: value,
                time: ''
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Check if a given date and time is within working hours
    const isWithinWorkingHours = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return false;
        
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const today = new Date();
        
        // Check if it's Sunday (closed)
        if (dayOfWeek === 0) return false;
        
        // Parse time
        const [hours, minutes] = timeStr.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        // Check if selected date is today
        const isToday = selectedDate.toDateString() === today.toDateString();
        
        // If it's today, check if the selected time is in the future
        if (isToday) {
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;
            
            if (timeInMinutes <= currentTimeInMinutes) {
                return false;
            }
        }
        
        // Check working hours based on day of week
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
            return timeInMinutes >= 8 * 60 && timeInMinutes <= 18 * 60;
        } else if (dayOfWeek === 6) { // Saturday
            return timeInMinutes >= 8 * 60 && timeInMinutes <= 12 * 60;
        }
        
        return false;
    };

    // Check if the selected time is outside working hours
    const isOutsideWorkingHours = form.date && form.time ? !isWithinWorkingHours(form.date, form.time) : false;
    
    // Check if the selected date is Sunday (closed)
    const isSelectedDateSunday = form.date ? new Date(form.date).getDay() === 0 : false;

    // Get available time slots (only within working hours)
    const availableTimes = form.date && form.doctor ?
        [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'
        ].filter(t => {
            // Chỉ show các khung giờ trong giờ làm việc và chưa bị đặt (dựa trên dữ liệu API, chỉ tính slot chưa bị huỷ)
            return isWithinWorkingHours(form.date, t) &&
                !appointments.some(a =>
                    String(a.doctorId || a.doctor) === String(form.doctor)
                    && (a.appointmentDate === form.date || a.date === form.date)
                    && (a.appointmentTime === t || a.time === t)
                    && !['CANCELLED', 'REJECTED'].includes((a.status || '').toUpperCase())
                );
        }) :
        [];

    // Get department name for display
    const getDepartmentName = (deptId) => {
        const dept = departments.find(d => d.id === deptId);
        return dept ? dept.name : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        const requiredFields = [
            { field: 'name', label: 'Họ tên' },
            { field: 'phone', label: 'Số điện thoại' },
            { field: 'gender', label: 'Giới tính' },
            { field: 'department', label: 'Khoa khám' },
            { field: 'doctor', label: 'Bác sĩ' },
            { field: 'date', label: 'Ngày khám' },
            { field: 'time', label: 'Khung giờ khám' }
        ];
        const missingField = requiredFields.find(item => !form[item.field]);
        if (missingField) {
            setError(`Vui lòng nhập ${missingField.label.toLowerCase()}!`);
            return;
        }
        if (isSelectedDateSunday) {
            setError('Chủ nhật bệnh viện không làm việc. Vui lòng chọn ngày khác.');
            return;
        }
        if (isOutsideWorkingHours) {
            setError('Giờ khám ngoài giờ làm việc. Vui lòng chọn giờ từ 8h-18h (T2-T6) hoặc 8h-12h (T7).');
            return;
        }
        // Kiểm tra trùng lịch trước khi gửi
        const isDuplicate = appointments.some(a =>
            String(a.doctorId || a.doctor) === String(form.doctor)
            && (a.appointmentDate === form.date || a.date === form.date)
            && (a.appointmentTime === form.time || a.time === form.time)
            && !['CANCELLED', 'REJECTED'].includes((a.status || '').toUpperCase())
        );
        if (isDuplicate) {
            setError('Khung giờ này đã có lịch hẹn. Vui lòng chọn khung giờ khác.');
            return;
        }
        if (availableTimes.length === 0) {
            setError('Không còn lịch trống. Vui lòng chọn bác sĩ, ngày hoặc giờ khác.');
            return;
        }
        const phoneRegex = /^(\+?84|0)[1-9][0-9]{8}$/;
        if (!phoneRegex.test(form.phone)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
            setError('Email không hợp lệ!');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            // 1. Kiểm tra patient theo email
            let patientId = null;
            let patientInfo = null;
            // Tự động lấy email từ user đăng nhập nếu form.email rỗng
            const userEmail = form.email || user?.email || userEmail;
            if (!form.email && user?.email) {
                form.email = user.email;
            }
            // Nếu đã có patient, tự động fill form và disable các trường cá nhân
            const patientRes = await fetch(`http://localhost:8082/api/patients?email=${encodeURIComponent(userEmail)}`, {
                headers: {
                    'x-user-id': userEmail
                }
            });
            if (patientRes.ok) {
                const data = await patientRes.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Đã có patient
                    patientId = data[0].id;
                    patientInfo = data[0];
                    // Tự động fill form và disable trường cá nhân
                    setForm(prev => ({
                        ...prev,
                        name: data[0].fullName || '',
                        phone: data[0].phoneNumber || '',
                        gender: data[0].gender || '',
                        dob: data[0].dob || '',
                        email: data[0].email || userEmail
                    }));
                    setPatientExists(true);
                } else {
                    // Chưa có patient, tạo mới
                    const createRes = await fetch('http://localhost:8082/api/patients', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-user-id': userEmail
                        },
                        body: JSON.stringify({
                            fullName: form.name,
                            dob: form.dob || null,
                            gender: form.gender,
                            email: form.email,
                            phoneNumber: form.phone,
                            address: form.address || '',
                            medicalHistory: '',
                            userId: 0
                        })
                    });
                    if (!createRes.ok) throw new Error('Không thể tạo mới thông tin bệnh nhân!');
                    const newPatient = await createRes.json();
                    patientId = newPatient.id;
                    patientInfo = newPatient;
                }
            } else {
                setError('Không thể kiểm tra thông tin bệnh nhân!');
                setIsSubmitting(false);
                return;
            }
            // 2. Tạo lịch hẹn
            const appointmentRes = await fetch('http://localhost:8084/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userEmail
                },
                body: JSON.stringify({
                    patientId,
                    doctorId: form.doctor,
                    doctorName: doctors.find(d => d.id === form.doctor)?.name || '',
                    medicalSpecialty: departments.find(d => d.id === form.department)?.name || '',
                    reason: form.note,
                    appointmentDate: form.date,
                    appointmentTime: form.time,
                    email: user?.email || userEmail // Thêm trường email
                })
            });
            if (!appointmentRes.ok) {
    let backendMsg = '';
    try {
        const errorData = await appointmentRes.json();
        backendMsg = errorData?.message || JSON.stringify(errorData);
    } catch (e) {
        backendMsg = await appointmentRes.text();
    }
    console.error('Backend error:', backendMsg);
    throw new Error('Không thể tạo lịch hẹn! ' + backendMsg);
}
            setSuccess('Đặt lịch khám thành công!');
            setForm({
                name: '',
                phone: '',
                gender: '',
                department: '',
                doctor: '',
                date: '',
                time: '',
                note: ''
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.');
            console.error('Appointment error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden', 
                    boxShadow: theme.shadows[3],
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: theme.shadows[6],
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                {/* Header */}
                <Box 
                    sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
                        color: 'white', 
                        p: 3, 
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                            opacity: 0.1,
                            zIndex: 0
                        }
                    }}
                >
                    <Typography variant="h4" fontWeight={600} sx={{ position: 'relative', zIndex: 1, mb: 1 }}>
                        ĐẶT LỊCH KHÁM BỆNH
                    </Typography>
                    <Typography variant="body2" sx={{ position: 'relative', zIndex: 1 }}>
                        Giờ làm việc: 8h-18h (Thứ 2 - Thứ 6) | 8h-12h (Thứ 7) | Chủ nhật nghỉ
                    </Typography>
                </Box>
                
                <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative' }}>
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3, 
                                borderRadius: 2,
                                '& .MuiAlert-icon': { alignItems: 'center' }
                            }}
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 3, 
                                borderRadius: 2,
                                '& .MuiAlert-icon': { alignItems: 'center' }
                            }}
                            onClose={() => setSuccess('')}
                        >
                            {success}
                        </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                                {/* Department */}
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel id="department-label">Chuyên khoa</InputLabel>
                                    <Select
                                        name="department"
                                        labelId="department-label"
                                        value={form.department}
                                        onChange={handleChange}
                                        label="Chuyên khoa"
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'background.paper',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: '1px',
                                            },
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: 1, color: 'text.secondary' }}>
                                                <LocalHospitalIcon fontSize="small" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="" disabled>
                                            <em>Chọn chuyên khoa</em>
                                        </MenuItem>
                                        {departments.map((dept) => (
                                            <MenuItem key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Doctor */}
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                                    <Select
                                        name="doctor"
                                        labelId="doctor-label"
                                        value={form.doctor}
                                        onChange={handleChange}
                                        label="Bác sĩ"
                                        disabled={!form.department}
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'background.paper',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: '1px',
                                            },
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: 1, color: 'text.secondary' }}>
                                                <PersonIcon fontSize="small" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="" disabled>
                                            <em>Chọn bác sĩ</em>
                                        </MenuItem>
                                        {filteredDoctors.length > 0 ? (
                                            filteredDoctors.map((doc) => (
                                                <MenuItem key={doc.id} value={doc.id}>
                                                    {doc.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>Chọn chuyên khoa trước</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>

                                {/* Name */}
                                <TextField
                                    label="Họ và tên *"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    margin="normal"
                                    disabled={patientExists}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 1 }}>
                                                <PersonIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="Nhập họ và tên đầy đủ"
                                />

                                {/* Gender */}
                                <FormControl component="fieldset" margin="normal" fullWidth>
                                    <FormLabel component="legend" sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
                                        Giới tính *
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        disabled={patientExists}
                                        sx={{
                                            '& .MuiButtonBase-root': {
                                                color: theme.palette.primary.main,
                                            },
                                            '& .Mui-checked': {
                                                color: theme.palette.primary.main,
                                            },
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem',
                                            },
                                            gap: 2,
                                            ml: 1
                                        }}
                                    >
                                        <FormControlLabel 
                                            value="male" 
                                            control={<Radio size="small" color="primary" />} 
                                            label="Nam" 
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                    borderRadius: 1,
                                                },
                                                px: 2,
                                                py: 0.5,
                                                mr: 0,
                                            }}
                                        />
                                        <FormControlLabel 
                                            value="female" 
                                            control={<Radio size="small" color="primary" />} 
                                            label="Nữ" 
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                    borderRadius: 1,
                                                },
                                                px: 2,
                                                py: 0.5,
                                            }}
                                        />
                                        <FormControlLabel 
                                            value="other" 
                                            control={<Radio size="small" color="primary" />} 
                                            label="Khác"
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                    borderRadius: 1,
                                                },
                                                px: 2,
                                                py: 0.5,
                                            }}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                                {/* Phone */}
                                <TextField
                                    label="Số điện thoại *"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    margin="normal"
                                    disabled={patientExists}
                                    placeholder="0987 654 321"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 1 }}>
                                                <PhoneIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                

                                {/* Date */}
                                <FormControl fullWidth margin="normal" required>
                                    <TextField
                                        label="Ngày khám *"
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 1 }}>
                                                    <CalendarMonthIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                        }}
                                    />
                                </FormControl>

                                {/* Time Slot */}
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Khung giờ khám *</InputLabel>
                                    <Select
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        label="Khung giờ khám *"
                                        disabled={!form.date || !form.doctor}
                                        size="small"
                                        error={isSelectedDateSunday || isOutsideWorkingHours}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: isSelectedDateSunday || isOutsideWorkingHours ? 'error.main' : 'primary.main',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: isSelectedDateSunday || isOutsideWorkingHours ? 'error.main' : 'primary.main',
                                                },
                                            },
                                        }}
                                    >
                                        {availableTimes.length > 0 ? (
                                            availableTimes.map(time => (
                                                <MenuItem key={time} value={time}>
                                                    {time}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>
                                                {isSelectedDateSunday 
                                                    ? 'Chủ nhật bệnh viện không làm việc' 
                                                    : isOutsideWorkingHours 
                                                        ? 'Giờ khám ngoài giờ làm việc' 
                                                        : 'Không có lịch trống, vui lòng chọn ngày/giờ khác'}
                                            </MenuItem>
                                        )}
                                    </Select>
                                    {(isSelectedDateSunday || isOutsideWorkingHours) && (
                                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, ml: 1 }}>
                                            ⚠️ {isSelectedDateSunday 
                                                ? 'Chủ nhật bệnh viện không làm việc' 
                                                : 'Giờ làm việc: 8h-18h (T2-T6), 8h-12h (T7)'}
                                        </Typography>
                                    )}
                                </FormControl>

                                {/* Notes */}
                                <TextField
                                    label="Ghi chú (nếu có)"
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    size="small"
                                    sx={{ bgcolor: '#f8f9fa' }}
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <Box sx={{ mt: 4, position: 'relative' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={isSubmitting}
                                sx={{ 
                                    py: 1.75, 
                                    fontWeight: 600, 
                                    textTransform: 'none', 
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.5)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đặt lịch khám'
                                )}
                            </Button>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, fontSize: '0.75rem' }}>
                                Bằng cách nhấn vào nút đặt lịch, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
                            </Typography>
                        </Box>
                    </form>
                </Box>
                

            </Paper>
        </Container>
    );
};

export default Appointments;