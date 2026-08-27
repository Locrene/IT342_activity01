package edu.cit.lobitana.activity01.repository;

import edu.cit.lobitana.activity01.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByCreatedBy(String createdBy);
}