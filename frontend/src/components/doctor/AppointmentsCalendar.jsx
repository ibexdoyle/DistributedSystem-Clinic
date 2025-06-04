import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parseISO, getDay, parse, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Paper,
  Typography,
  Chip,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Today as TodayIcon,
  ViewWeek as ViewWeekIcon,
  CalendarViewMonth as CalendarViewMonthIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

// Set up the localizer with date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { vi },
});

const AppointmentsCalendar = ({ events, onSelectEvent, onNavigate, date, onView, view }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Custom event component
  const EventComponent = ({ event }) => {
    return (
      <Box
        sx={{
          height: '100%',
          p: 0.5,
          overflow: 'hidden',
          borderRadius: 1,
          fontSize: '0.8rem',
          color: 'white',
          bgcolor: 
            event.status === 'completed' ? theme.palette.success.main :
            event.status === 'cancelled' ? theme.palette.error.main :
            event.status === 'in_progress' ? theme.palette.warning.main :
            theme.palette.primary.main,
          '&:hover': {
            opacity: 0.9,
            cursor: 'pointer'
          }
        }}
      >
        <Box fontWeight="bold">{event.title.split(' - ')[0]}</Box>
        <Box fontSize="0.7rem">
          {format(event.start, 'HH:mm')} - {event.service}
        </Box>
      </Box>
    );
  };

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        p: 1,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onNavigate('TODAY')}
            startIcon={<TodayIcon />}
          >
            Hôm nay
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => onNavigate('PREV')}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="subtitle1" sx={{ minWidth: 150, textAlign: 'center' }}>
              {label}
            </Typography>
            <IconButton size="small" onClick={() => onNavigate('NEXT')}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        
        <ButtonGroup size="small" variant="outlined">
          <Button 
            onClick={() => onView('day')} 
            variant={view === 'day' ? 'contained' : 'outlined'}
            startIcon={<TodayIcon />}
          >
            Ngày
          </Button>
          <Button 
            onClick={() => onView('week')} 
            variant={view === 'week' ? 'contained' : 'outlined'}
            startIcon={<ViewWeekIcon />}
          >
            Tuần
          </Button>
          <Button 
            onClick={() => onView('month')} 
            variant={view === 'month' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonthIcon />}
          >
            Tháng
          </Button>
        </ButtonGroup>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        onView={onView}
        view={view}
        date={date}
        components={{
          event: EventComponent,
          toolbar: props => <CustomToolbar {...props} />
        }}
        messages={{
          today: 'Hôm nay',
          previous: 'Trước',
          next: 'Sau',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Lịch trình',
          date: 'Ngày',
          time: 'Giờ',
          event: 'Sự kiện',
          noEventsInRange: 'Không có lịch hẹn nào trong khoảng thời gian này.'
        }}
        eventPropGetter={(event) => {
          let backgroundColor = '';
          
          switch(event.status) {
            case 'completed':
              backgroundColor = theme.palette.success.main;
              break;
            case 'cancelled':
              backgroundColor = theme.palette.error.main;
              break;
            case 'in_progress':
              backgroundColor = theme.palette.warning.main;
              break;
            default:
              backgroundColor = theme.palette.primary.main;
          }
          
          return {
            style: {
              backgroundColor,
              borderRadius: '4px',
              opacity: 0.9,
              color: 'white',
              border: '0px',
              display: 'block'
            }
          };
        }}
      />
    </Paper>
  );
};

export default AppointmentsCalendar;
