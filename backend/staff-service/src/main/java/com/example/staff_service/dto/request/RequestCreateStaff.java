package com.example.staff_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RequestCreateStaff {
    @NotBlank
    private String fullName;
    private LocalDate dob;
    private String gender;

    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    private String department;

    @NotNull
    private String staffRole;
    private Boolean isActive;
    private List<Long> shiftIds;
}
