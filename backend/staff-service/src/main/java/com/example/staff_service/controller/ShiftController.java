package com.example.staff_service.controller;

import com.example.staff_service.model.Shift;
import com.example.staff_service.model.Staff;
import com.example.staff_service.repository.StaffRepository;
import com.example.staff_service.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @Autowired
    private StaffRepository staffRepository;

    // API xem tất cả các ca làm việc
    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    // API xem danh sách ca theo ngày
    @GetMapping("/day/{dayOfWeek}")
    public List<Shift> getShiftsByDay(@PathVariable String dayOfWeek) {
        return shiftService.getShiftsByDay(dayOfWeek);
    }

    // API tìm Staff theo ID ca làm việc
    @GetMapping("/{shiftId}/staffs")
    public List<Staff> getStaffByShift(@PathVariable Long shiftId) {
        return staffRepository.findAll()
                .stream()
                .filter(s -> s.getShifts().stream().anyMatch(shift -> shift.getId().equals(shiftId)))
                .toList();
    }

    // API xem lịch làm việc dạng calendar
    @GetMapping("/calendars")
    public Map<String, List<Map<String, Object>>> getCalendarView() {
        Map<String, List<Map<String, Object>>> calendar = new LinkedHashMap<>();

        for (Shift.DayOfWeek day : Shift.DayOfWeek.values()) {
            List<Shift> shifts = shiftService.getShiftsByDay(day.name());

            List<Map<String, Object>> shiftDetails = new ArrayList<>();
            for (Shift shift : shifts) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("shiftId", shift.getId());
                entry.put("start", shift.getStartTime().toString());
                entry.put("end", shift.getEndTime().toString());

                List<String> staffNames = staffRepository.findAll().stream()
                        .filter(s -> s.getShifts().contains(shift))
                        .map(Staff::getFullName)
                        .toList();

                entry.put("staff", staffNames);
                shiftDetails.add(entry);
            }

            calendar.put(day.name(), shiftDetails);
        }

        return calendar;
    }
}