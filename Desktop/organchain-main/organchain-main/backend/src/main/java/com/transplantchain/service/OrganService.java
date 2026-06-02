package com.transplantchain.service;

import com.transplantchain.entity.MatchRecord;
import com.transplantchain.entity.PledgeRecord;
import com.transplantchain.repository.MatchRecordRepository;
import com.transplantchain.repository.PledgeRecordRepository;
import com.transplantchain.repository.SecurityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrganService {

    @Autowired
    private PledgeRecordRepository pledgeRecordRepository;

    @Autowired
    private MatchRecordRepository matchRecordRepository;

    @Autowired
    private SecurityLogRepository securityLogRepository;

    public List<PledgeRecord> getPledgesByStatus(String status) {
        return pledgeRecordRepository.findByRole(status);
    }

    public List<MatchRecord> getMatchesByStatus(String status) {
        return matchRecordRepository.findAll().stream()
                .filter(m -> status.equals(m.getStatus()))
                .collect(Collectors.toList());
    }

    public List<PledgeRecord> getPledgesByHospital(String hospitalId) {
        return pledgeRecordRepository.findByHospitalId(hospitalId);
    }

    public Map<String, Long> getOrganStats() {
        List<PledgeRecord> all = pledgeRecordRepository.findAll();
        long donors = all.stream().filter(p -> "DONOR".equals(p.getRole())).count();
        long recipients = all.stream().filter(p -> "RECIPIENT".equals(p.getRole())).count();
        return Map.of("donors", donors, "recipients", recipients, "total", (long) all.size());
    }

    public boolean verifyOrganStatus(Long pledgeId) {
        return pledgeRecordRepository.findById(pledgeId)
                .map(record -> record.getRole() != null)
                .orElse(false);
    }

    public long countByStatus(String status) {
        return pledgeRecordRepository.findByRole(status).size();
    }
}
