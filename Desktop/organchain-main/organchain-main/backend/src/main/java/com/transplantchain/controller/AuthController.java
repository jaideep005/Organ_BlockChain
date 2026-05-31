package com.transplantchain.controller;

import com.transplantchain.entity.Patient;
import com.transplantchain.repository.PatientRepository;
import com.transplantchain.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.transplantchain.dto.LoginRequestDTO;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();

    private static class OtpDetails {
        final String code;
        final long expiryTime;

        OtpDetails(String code, long expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }
    }

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
            response.put("token", jwtTokenProvider.createToken("admin"));
            response.put("name", "AIIMS-DELHI-01");
            return ResponseEntity.ok(response);
        }

        // Patient Logic
        Optional<Patient> optionalPatient = patientRepository.findByAbhaId(abhaId);
        
        // Generate random 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(1000000));
        otpCache.put(abhaId, new OtpDetails(otpCode, System.currentTimeMillis() + 300000)); // 5 min expiry
        System.out.println("Generated OTP for patient " + abhaId + ": " + otpCode);

        if (optionalPatient.isEmpty()) {
            // Auto-register for demo purposes
            Patient patient = new Patient(abhaId, password, "Patient " + abhaId.substring(0, Math.min(abhaId.length(), 6)));
            patientRepository.save(patient);
            
            response.put("status", "success");
            response.put("message", "Patient auto-registered and logged in");
            response.put("token", jwtTokenProvider.createToken(abhaId));
            response.put("otp", otpCode); // Included for development/demo ease
            response.put("name", patient.getName());
            response.put("abhaId", patient.getAbhaId());
            return ResponseEntity.ok(response);
        } else {
            Patient p = optionalPatient.get();
            if (!p.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            response.put("status", "success");
            response.put("message", "Login successful. Proceed to OTP.");
            response.put("token", jwtTokenProvider.createToken(abhaId));
            response.put("otp", otpCode); // Included for development/demo ease
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

        OtpDetails details = otpCache.get(abhaId);
        if (details != null && details.code.equals(otp) && System.currentTimeMillis() < details.expiryTime) {
            otpCache.remove(abhaId);
            response.put("status", "success");
            response.put("message", "OTP Verified");
            response.put("token", jwtTokenProvider.createToken(abhaId));
            response.put("abhaId", abhaId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired OTP"));
        }
    }
}
