package com.example.staff_service.service.impl;

import com.example.staff_service.model.Shift;
import com.example.staff_service.repository.ShiftRepository;
import com.example.staff_service.service.ShiftService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Override
    public Shift getShiftById(Long id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }

    @Override
    public List<Shift> getShiftsByDay(String dayOfWeek) {
        return shiftRepository.findAll()
                .stream()
                .filter(s -> s.getDayOfWeek().name().equalsIgnoreCase(dayOfWeek))
                .toList();
    }

    @PostConstruct
    public void createWeeklyShifts() {
        if (shiftRepository.count() == 0) {
            List<Shift> shifts = new ArrayList<>();
            LocalTime[][] shiftTimes = {
                    {LocalTime.of(7, 0), LocalTime.of(11, 0)},
                    {LocalTime.of(13, 0), LocalTime.of(18, 0)},
                    {LocalTime.of(19, 0), LocalTime.of(23, 0)}
            };

            for (Shift.DayOfWeek day : Shift.DayOfWeek.values()) {
                for (LocalTime[] times : shiftTimes) {
                    shifts.add(Shift.builder()
                            .dayOfWeek(day)
                            .startTime(times[0])
                            .endTime(times[1])
                            .build());
                }
            }

            shiftRepository.saveAll(shifts);
        }
    }
}
