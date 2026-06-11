package com.transplantchain.controller;

import com.transplantchain.entity.Patient;
import com.transplantchain.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.transplantchain.dto.LoginRequestDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequestDTO request) {
        String abhaId = request.getAbhaId();
        String password = request.getPassword();
        String role = request.getRole();

        Map<String, Object> response = new HashMap<>();

        if ("admin".equals(role)) {
            // Admin logic expects web3 metamask sig checking. This is validated on frontend.
            // On backend we just verify they exist or mock a success since it's an admin bypass.
            response.put("status", "success");
            response.put("message", "Admin clearance granted");
            response.put("token", UUID.randomUUID().toString());
            response.put("name", "AIIMS-DELHI-01");
            return ResponseEntity.ok(response);
        }

        // Patient Logic
        Optional<Patient> optionalPatient = patientRepository.findByAbhaId(abhaId);
        if (optionalPatient.isEmpty()) {
            // Auto-register for demo purposes
            String hashedPassword = passwordEncoder.encode(password);
            Patient patient = new Patient(abhaId, hashedPassword, "Patient " + abhaId.substring(0, Math.min(abhaId.length(), 6)));
            patientRepository.save(patient);
            
            response.put("status", "success");
            response.put("message", "Patient auto-registered and logged in");
            response.put("token", UUID.randomUUID().toString());
            response.put("name", patient.getName());
            response.put("abhaId", patient.getAbhaId());
            return ResponseEntity.ok(response);
        } else {
            Patient p = optionalPatient.get();
            if (!passwordEncoder.matches(password, p.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            response.put("status", "success");
            response.put("message", "Login successful. Proceed to OTP.");
            response.put("token", UUID.randomUUID().toString());
            response.put("name", p.getName());
            response.put("abhaId", p.getAbhaId());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody LoginRequestDTO request) {
        String abhaId = request.getAbhaId();
        String otp = request.getOtp();
        
        Map<String, Object> response = new HashMap<>();

        if ("123456".equals(otp)) {
            response.put("status", "success");
            response.put("message", "OTP Verified");
            response.put("token", UUID.randomUUID().toString());
            response.put("abhaId", abhaId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid OTP"));
        }
    }
}
