package edu.cit.lobitana.activity01.controller;

import edu.cit.lobitana.activity01.entity.ServiceRequest;
import edu.cit.lobitana.activity01.repository.ServiceRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestRepository requestRepository;

    public ServiceRequestController(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    // POST /api/requests
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ServiceRequest request, Authentication authentication) {
        String username = authentication.getName(); // comes from the validated JWT, never from the request body

        request.setId(null);
        request.setCreatedBy(username);
        ServiceRequest saved = requestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    // GET /api/requests
    @GetMapping
    public ResponseEntity<Object> getMyRequests(Authentication authentication) {
        String username = authentication.getName();
        List<ServiceRequest> myRequests = requestRepository.findByCreatedBy(username);
        return ResponseEntity.ok(myRequests);
    }

    // GET /api/requests/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOne(@PathVariable Long id, Authentication authentication) {
        Optional<ServiceRequest> found = requestRepository.findById(id);

        if (found.isEmpty()) {
            return notFound(id);
        }
        if (!found.get().getCreatedBy().equals(authentication.getName())) {
            return forbidden();
        }
        return ResponseEntity.ok(found.get());
    }

    // PUT /api/requests/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody ServiceRequest updated, Authentication authentication) {
        Optional<ServiceRequest> found = requestRepository.findById(id);

        if (found.isEmpty()) {
            return notFound(id);
        }
        ServiceRequest existing = found.get();
        if (!existing.getCreatedBy().equals(authentication.getName())) {
            return forbidden();
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        // createdBy and dateCreated are never overwritten by client input

        ServiceRequest saved = requestRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    // DELETE /api/requests/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id, Authentication authentication) {
        Optional<ServiceRequest> found = requestRepository.findById(id);

        if (found.isEmpty()) {
            return notFound(id);
        }
        if (!found.get().getCreatedBy().equals(authentication.getName())) {
            return forbidden();
        }

        requestRepository.delete(found.get());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Service request deleted");
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Object> notFound(Long id) {
        Map<String, Object> error = new HashMap<>();
        error.put("message", "Service request with id " + id + " not found");
        return ResponseEntity.status(404).body(error);
    }

    private ResponseEntity<Object> forbidden() {
        Map<String, Object> error = new HashMap<>();
        error.put("message", "You do not have permission to access this service request");
        return ResponseEntity.status(403).body(error);
    }
}