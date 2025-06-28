package com.example.staff_service.service;

import com.example.staff_service.model.Shift;

import java.util.List;

public interface ShiftService {
    List<Shift> getAllShifts();
    Shift getShiftById(Long id);
    List<Shift> getShiftsByDay(String dayOfWeek);
}
