import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isToday, isSameMonth } from 'date-fns';
import { Box, Typography, Paper, Button, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { vi } from 'date-fns/locale';

// Custom styled day button
const DayButton = ({ 
  day, 
  isSelected, 
  hasAppointments, 
  isCurrentMonth,
  isCurrentDay,
  onClick 
}) => {
  const theme = useTheme();
  
  return (
    <Button
      onClick={onClick}
      disabled={!day}
      sx={{
        minWidth: 32,
        height: 32,
        p: 0,
        position: 'relative',
        borderRadius: '50%',
        color: !day ? 'transparent' : 
               isSelected ? '#fff' : 
               isCurrentDay ? '#fff' : 
               !isCurrentMonth ? theme.palette.text.disabled : theme.palette.text.primary,
        backgroundColor: isSelected 
          ? theme.palette.primary.main 
          : isCurrentDay 
            ? theme.palette.primary.light 
            : 'transparent',
        fontWeight: isSelected || isCurrentDay ? 600 : 400,
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: isSelected 
            ? theme.palette.primary.dark 
            : isCurrentDay
              ? theme.palette.primary.main
              : theme.palette.action.hover,
        },
        '&.Mui-disabled': {
          color: 'transparent',
          backgroundColor: 'transparent',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {day?.getDate()}
    </Button>
  );
};

const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const CalendarView = ({ appointments, currentDate, onDateChange, onDayClick, selectedDate }) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  });

  // Tính ngày bắt đầu của lịch (có thể là tháng trước)
  const startDay = firstDayOfMonth.getDay();
  const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1;
  
  // Tạo mảng các ngày trong tháng hiện tại
  const allDays = [];
  
  // Thêm các ngày từ tháng trước (nếu có)
  for (let i = 0; i < daysFromPrevMonth; i++) {
    allDays.push(null);
  }
  
  // Thêm các ngày trong tháng
  allDays.push(...daysInMonth);
  
  // Thêm các ngày từ tháng sau để hoàn thiện lưới
  const remainingDays = 42 - allDays.length; // 6 hàng x 7 cột = 42 ô
  for (let i = 1; i <= remainingDays; i++) {
    allDays.push(null);
  }

  // Đếm số lượng cuộc hẹn trong ngày
  const getAppointmentsCount = (day) => {
    if (!day) return 0;
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), day)
    ).length;
  };



  // Chuyển tháng
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onDateChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onDateChange(nextMonth);
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        px: 1
      }}>
        <IconButton 
          onClick={handlePrevMonth} 
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Typography 
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </Typography>
        <IconButton 
          onClick={handleNextMonth} 
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      
      {/* Weekday headers */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        mb: 1,
        px: 1
      }}>
        {weekdays.map((day) => (
          <Typography 
            key={day} 
            variant="caption"
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              py: 1,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>
      
      {/* Calendar days */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridAutoRows: '32px',
        gap: '4px',
        px: 1,
        mb: 1
      }}>
        {allDays.map((day, index) => {
          const count = day ? getAppointmentsCount(day) : 0;
          const isCurrentMonthDay = day && isSameMonth(day, currentDate);
          const isDayToday = day && isToday(day);
          const isDaySelected = selectedDate && day && isSameDay(day, selectedDate);
          
          return (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DayButton
                day={day}
                isSelected={!!isDaySelected}
                hasAppointments={count}
                isCurrentMonth={isCurrentMonthDay}
                isCurrentDay={isDayToday}
                onClick={() => day && onDayClick(day)}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarView;
