package com.example.patient_service.mapper;


import com.example.patient_service.dto.request.RequestCreatePatient;
import com.example.patient_service.dto.request.RequestUpdatePatient;
import com.example.patient_service.dto.response.ResponsePatient;
import com.example.patient_service.model.Patient;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(componentModel = "spring")
public interface PatientMapper {

    ResponsePatient toDTO(Patient patient);

    Patient toEntity(RequestCreatePatient request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePatient(@MappingTarget Patient patient, RequestUpdatePatient request);
}