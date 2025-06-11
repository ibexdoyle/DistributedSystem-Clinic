import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider,
  Badge,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  EventNote as EventNoteIcon,
  Assignment as AssignmentIcon,
  Announcement as AnnouncementIcon,
  MoreVert as MoreVertIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';

// Mock data for notifications
const notifications = [
  {
    id: 1,
    title: 'Lịch hẹn mới',
    message: 'Bạn có lịch hẹn khám mới vào ngày 15/06/2024',
    time: '10 phút trước',
    read: false,
    type: 'appointment'
  },
  {
    id: 2,
    title: 'Nhắc nhở khám bệnh',
    message: 'Bạn có lịch tái khám vào ngày 20/06/2024',
    time: '1 giờ trước',
    read: false,
    type: 'reminder'
  },
  {
    id: 3,
    title: 'Thông báo hệ thống',
    message: 'Hệ thống sẽ bảo trì vào lúc 23:00 ngày 12/06/2024',
    time: '1 ngày trước',
    read: true,
    type: 'system'
  },
  {
    id: 4,
    title: 'Kết quả xét nghiệm',
    message: 'Kết quả xét nghiệm của bạn đã có sẵn',
    time: '2 ngày trước',
    read: true,
    type: 'result'
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment':
      return <EventNoteIcon color="primary" />;
    case 'reminder':
      return <AssignmentIcon color="warning" />;
    case 'result':
      return <AssignmentIcon color="success" />;
    default:
      return <AnnouncementIcon color="info" />;
  }
};

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Thông báo
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} mới`} 
              color="primary" 
              size="small" 
              sx={{ ml: 2, fontWeight: 'normal' }}
            />
          )}
        </Typography>
        <Box>
          <IconButton color="primary" aria-label="mark all as read">
            <CheckCircleOutlineIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>Đánh dấu đã đọc tất cả</Typography>
          </IconButton>
        </Box>
      </Box>

      <Paper elevation={2}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem 
                alignItems="flex-start"
                secondaryAction={
                  <IconButton edge="end" aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography 
                        variant="subtitle1" 
                        component="span" 
                        fontWeight={notification.read ? 'normal' : 'bold'}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'inline-block',
                        fontWeight: notification.read ? 'normal' : 'medium'
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Notifications;
