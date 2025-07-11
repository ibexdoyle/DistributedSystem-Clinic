import React, { useState } from 'react';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Danh sách các vai trò trong hệ thống
const ROLES = ['Quản trị viên', 'Bác sĩ', 'Điều dưỡng', 'Lễ tân'];

// Dummy data - Thay thế bằng dữ liệu thực tế từ API
const createUserData = (id, name, email, role, status, lastLogin) => ({
  id, name, email, role, status, lastLogin
});

const users = [
  createUserData(1, 'Admin', 'admin@example.com', 'Quản trị viên', 'active', '2023-05-25 10:30'),
  createUserData(2, 'Bác sĩ A', 'doctor1@example.com', 'Bác sĩ', 'active', '2023-05-25 09:15'),
  createUserData(3, 'Điều dưỡng A', 'nurse1@example.com', 'Điều dưỡng', 'active', '2023-05-24 14:20'),
  createUserData(4, 'Nhân viên lễ tân', 'reception@example.com', 'Lễ tân', 'inactive', '2023-05-23 16:45'),
  createUserData(5, 'Bác sĩ B', 'doctor2@example.com', 'Bác sĩ', 'active', '2023-05-25 11:10'),
];

const roles = ['Tất cả', 'Quản trị viên', 'Bác sĩ', 'Điều dưỡng', 'Lễ tân'];

const Users = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Tất cả');
  const [anchorFilterEl, setAnchorFilterEl] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [users, setUsers] = useState([
    createUserData(1, 'Admin', 'admin@example.com', 'Quản trị viên', 'active', '2023-05-25 10:30'),
    createUserData(2, 'Bác sĩ A', 'doctor1@example.com', 'Bác sĩ', 'active', '2023-05-25 09:15'),
    createUserData(3, 'Điều dưỡng A', 'nurse1@example.com', 'Điều dưỡng', 'active', '2023-05-24 14:20'),
    createUserData(4, 'Nhân viên lễ tân', 'reception@example.com', 'Lễ tân', 'inactive', '2023-05-23 16:45'),
    createUserData(5, 'Bác sĩ B', 'doctor2@example.com', 'Bác sĩ', 'active', '2023-05-25 11:10'),
  ]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Bác sĩ',
    phone: '',
    status: 'active',
    birthDate: null
  });
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleFilterClick = (event) => {
    setAnchorFilterEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorFilterEl(null);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setPage(0);
    handleFilterClose();
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Bác sĩ',
      phone: '',
      status: 'active',
      birthDate: null
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newUser.name) newErrors.name = 'Vui lòng nhập họ tên';
    if (!newUser.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!newUser.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (newUser.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    if (!newUser.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)\d{9,10}$/.test(newUser.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!newUser.birthDate) {
      newErrors.birthDate = 'Vui lòng chọn ngày sinh';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleAddUser = () => {
    if (validateForm()) {
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      const userToAdd = {
        ...newUser,
        id: newId,
        lastLogin: new Date().toISOString()
      };
      setUsers([userToAdd, ...users]);
      enqueueSnackbar('Thêm tài khoản thành công!', { variant: 'success' });
      handleCloseAddDialog();
    }
  };

  const handleEditUser = () => {
    if (validateForm(editingUser)) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...editingUser, lastLogin: new Date().toISOString() }
          : user
      ));
      enqueueSnackbar('Cập nhật tài khoản thành công!', { variant: 'success' });
      setOpenEditDialog(false);
      setEditingUser(null);
    }
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    enqueueSnackbar(
      `Đã ${users.find(u => u.id === userId)?.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản thành công!`, 
      { variant: 'success' }
    );
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== userToDelete));
    enqueueSnackbar('Đã xóa tài khoản thành công!', { variant: 'success' });
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleOpenDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Tất cả' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Quản lý tài khoản</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PersonAddIcon />}
          onClick={handleOpenAddDialog}
        >
          Thêm tài khoản
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm tên hoặc email..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 250 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ ml: 'auto' }}
          >
            {selectedRole}
          </Button>
          
          <Menu
            anchorEl={anchorFilterEl}
            open={Boolean(anchorFilterEl)}
            onClose={handleFilterClose}
          >
            {roles.map((role) => (
              <MenuItem 
                key={role} 
                onClick={() => handleRoleSelect(role)}
                selected={role === selectedRole}
              >
                {role}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đăng nhập cuối</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredUsers
            ).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    color={
                      user.role === 'Quản trị viên' ? 'primary' : 
                      user.role === 'Bác sĩ' ? 'secondary' : 'default'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'} 
                    size="small" 
                    color={user.status === 'active' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(user.lastLogin).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, user.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count}`
          }
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleOpenEditDialog(users.find(u => u.id === selectedUserId))}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleToggleUserStatus(selectedUserId)}>
          <ListItemIcon>
            {users.find(u => u.id === selectedUserId)?.status === 'active' ? (
              <LockIcon fontSize="small" color="error" />
            ) : (
              <LockOpenIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {users.find(u => u.id === selectedUserId)?.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleOpenDeleteConfirm(selectedUserId)} 
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>

      {/* Xác nhận xóa */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa tài khoản */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => {
          setOpenEditDialog(false);
          setEditingUser(null);
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="name"
                  value={editingUser?.name || ''}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={editingUser?.phone || ''}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" size="small" error={!!errors.role}>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={editingUser?.role || ''}
                    label="Vai trò"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                    <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
                    <MenuItem value="Điều dưỡng">Điều dưỡng</MenuItem>
                    <MenuItem value="Lễ tân">Lễ tân</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={editingUser?.status || 'active'}
                    label="Trạng thái"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Đang hoạt động</MenuItem>
                    <MenuItem value="inactive">Vô hiệu hóa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenEditDialog(false);
              setEditingUser(null);
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleEditUser} 
            color="primary" 
            variant="contained"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Thêm tài khoản mới */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm tài khoản mới</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" size="small" error={!!errors.role}>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={newUser.role}
                    label="Vai trò"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                    <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
                    <MenuItem value="Điều dưỡng">Điều dưỡng</MenuItem>
                    <MenuItem value="Lễ tân">Lễ tân</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                    label="Ngày sinh"
                    value={newUser.birthDate}
                    onChange={(date) => 
                      setNewUser(prev => ({ ...prev, birthDate: date }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        size="small"
                        error={!!errors.birthDate}
                        helperText={errors.birthDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={newUser.status}
                    label="Trạng thái"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Đang hoạt động</MenuItem>
                    <MenuItem value="inactive">Vô hiệu hóa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
