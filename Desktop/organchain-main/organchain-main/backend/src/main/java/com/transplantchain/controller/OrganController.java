package com.transplantchain.controller;

import com.transplantchain.entity.PledgeRecord;
import com.transplantchain.service.OrganService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/organs")
public class OrganController {

    @Autowired
    private OrganService organService;

    @GetMapping("/status/{role}")
    public ResponseEntity<List<PledgeRecord>> getOrgansByStatus(@PathVariable String role) {
        return ResponseEntity.ok(organService.getPledgesByStatus(role));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getOrganStats() {
        return ResponseEntity.ok(organService.getOrganStats());
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<PledgeRecord>> getOrgansByHospital(@PathVariable String hospitalId) {
        return ResponseEntity.ok(organService.getPledgesByHospital(hospitalId));
    }

    @GetMapping("/verify/{pledgeId}")
    public ResponseEntity<Map<String, Boolean>> verifyOrgan(@PathVariable Long pledgeId) {
        boolean valid = organService.verifyOrganStatus(pledgeId);
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @GetMapping("/count/{status}")
    public ResponseEntity<Map<String, Long>> countByStatus(@PathVariable String status) {
        long count = organService.countByStatus(status);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
