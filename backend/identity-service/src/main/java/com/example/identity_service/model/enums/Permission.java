package com.example.identity_service.model.enums;


public enum Permission {
    // Auth
    MANAGE_USERS,
    VIEW_USERS,

    // Patient
    VIEW_PATIENT,
    CREATE_PATIENT,
    EDIT_PATIENT,
    DELETE_PATIENT,

    // Staff
    VIEW_STAFF,
    CREATE_STAFF,
    EDIT_STAFF,
    DELETE_STAFF,

    // Appointment
    VIEW_APPOINTMENT,
    CREATE_APPOINTMENT,
    EDIT_APPOINTMENT,
    DELETE_APPOINTMENT,

    // Prescription
    VIEW_PRESCRIPTION,
    CREATE_PRESCRIPTION,
    EDIT_PRESCRIPTION,
    DELETE_PRESCRIPTION,

    // Medicine
    VIEW_MEDICINE,
    CREATE_MEDICINE,
    EDIT_MEDICINE,
    DELETE_MEDICINE,

    // Notification
    SEND_NOTIFICATION,
    VIEW_NOTIFICATION,

    // Report
    VIEW_REPORT,
    GENERATE_REPORT,

    // Billing
    VIEW_BILLING,
    CREATE_BILLING,
    EDIT_BILLING,
    DELETE_BILLING
}

