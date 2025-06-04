import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Avatar, 
  IconButton, 
  Divider, 
  Button,
  Tooltip
} from '@mui/material';
import { 
  Person, 
  Phone, 
  AccessTime, 
  MedicalServices,
  MoreVert,
  CheckCircle,
  Pending,
  Close,
  Info
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const statusConfig = {
  confirmed: { 
    label: 'Đã xác nhận', 
    color: 'primary', 
    icon: <CheckCircle fontSize="small" /> 
  },
  pending: { 
    label: 'Đang chờ', 
    color: 'warning', 
    icon: <Pending fontSize="small" /> 
  },
  in_progress: { 
    label: 'Đang khám', 
    color: 'info', 
    icon: <AccessTime fontSize="small" /> 
  },
  completed: { 
    label: 'Đã khám', 
    color: 'success', 
    icon: <CheckCircle fontSize="small" /> 
  },
  cancelled: { 
    label: 'Đã hủy', 
    color: 'error', 
    icon: <Close fontSize="small" /> 
  }
};

const AppointmentCard = ({ 
  appointment, 
  onSelect, 
  onStatusChange,
  onStartAppointment,
  onCompleteAppointment,
  onCancelAppointment
}) => {
  const { 
    patientName, 
    patientId,
    phone, 
    time, 
    service, 
    status, 
    reason 
  } = appointment;

  const statusInfo = statusConfig[status] || statusConfig.pending;
  const appointmentTime = parseISO(time);
  const formattedTime = format(appointmentTime, 'HH:mm');
  const formattedDate = format(appointmentTime, 'dd/MM/yyyy');

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        overflow: 'hidden',
        borderLeft: `4px solid ${statusInfo.color}.main`,
        '&:hover': {
          boxShadow: 4,
          cursor: 'pointer',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={() => onSelect(appointment)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ 
          textAlign: 'center', 
          mr: 2, 
          minWidth: 60,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          pr: 2
        }}>
          <Typography variant="h6" color="primary">
            {formattedTime}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'medium' }}>
                {patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Mã BN: {patientId} | {phone}
              </Typography>
            </Box>
            <Chip
              label={statusInfo.label}
              size="small"
              color={statusInfo.color}
              icon={statusInfo.icon}
              sx={{ ml: 1 }}
            />
          </Box>
          
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={service}
              size="small"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              icon={<MedicalServices fontSize="small" />}
            />
            {reason && (
              <Tooltip title={reason} arrow>
                <Chip
                  label="Xem lý do khám"
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  icon={<Info fontSize="small" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show reason in a dialog or tooltip
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 1,
        bgcolor: 'action.hover',
        '& > *': {
          fontSize: '0.75rem',
          textTransform: 'none'
        }
      }}>
        {status === 'confirmed' && (
          <Button 
            variant="contained" 
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onStartAppointment(appointment.id);
            }}
          >
            Bắt đầu khám
          </Button>
        )}
        
        {status === 'in_progress' && (
          <Button 
            variant="contained" 
            size="small"
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              onCompleteAppointment(appointment.id);
            }}
          >
            Hoàn thành
          </Button>
        )}
        
        {status !== 'completed' && status !== 'cancelled' && (
          <Button 
            variant="outlined" 
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onCancelAppointment(appointment.id);
            }}
          >
            Hủy
          </Button>
        )}
        
        <Button 
          variant="text" 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(appointment);
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Paper>
  );
};

export default AppointmentCard;
