package com.example.staff_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestUpdateStaff {
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String phoneNumber;
    private String department;
    private String staffRole;
    private Boolean isActive;
    private List<Long> shiftIds;
}
