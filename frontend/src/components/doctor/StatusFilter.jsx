import React from 'react';
import { Box, Chip, Typography, Menu, MenuItem, Button } from '@mui/material';
import { FilterList } from '@mui/icons-material';

const statusOptions = [
  { value: 'all', label: 'Tất cả', color: 'default' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'primary' },
  { value: 'pending', label: 'Đang chờ', color: 'warning' },
  { value: 'in_progress', label: 'Đang khám', color: 'info' },
  { value: 'completed', label: 'Đã khám', color: 'success' },
  { value: 'cancelled', label: 'Đã hủy', color: 'error' },
];

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status) => {
    onStatusChange(status);
    handleClose();
  };

  const selectedOption = statusOptions.find(opt => opt.value === selectedStatus) || statusOptions[0];

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        onClick={handleClick}
        size="small"
        sx={{ mr: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Trạng thái:</Typography>
          <Chip 
            label={selectedOption.label}
            size="small"
            color={selectedOption.color}
            variant="outlined"
          />
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleStatusSelect(option.value)}
            selected={selectedStatus === option.value}
          >
            <Chip 
              label={option.label}
              size="small"
              color={option.color}
              variant={selectedStatus === option.value ? 'filled' : 'outlined'}
              sx={{ mr: 1, minWidth: 100 }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default StatusFilter;
