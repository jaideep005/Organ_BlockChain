package com.transplantchain.service;

import com.transplantchain.entity.MatchRecord;
import com.transplantchain.entity.PledgeRecord;
import com.transplantchain.repository.MatchRecordRepository;
import com.transplantchain.repository.PledgeRecordRepository;
import com.transplantchain.repository.SecurityLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link OrganService}.
 *
 * Uses Mockito to isolate the service layer from JPA repositories,
 * allowing fast, in-memory test execution without a running database.
 */
@ExtendWith(MockitoExtension.class)
class OrganServiceTest {

    @Mock
    private PledgeRecordRepository pledgeRecordRepository;

    @Mock
    private MatchRecordRepository matchRecordRepository;

    @Mock
    private SecurityLogRepository securityLogRepository;

    @InjectMocks
    private OrganService organService;

    // ── Fixtures ────────────────────────────────────────────────────────────

    private PledgeRecord donorRecord;
    private PledgeRecord recipientRecord;
    private MatchRecord pendingMatch;
    private MatchRecord completedMatch;

    @BeforeEach
    void setUp() {
        donorRecord = new PledgeRecord();
        donorRecord.setRole("DONOR");
        donorRecord.setPatientName("Ramesh Kumar");
        donorRecord.setBloodGroup("O+");
        donorRecord.setOrgan("Kidney");
        donorRecord.setHospitalId("HOSP-001");

        recipientRecord = new PledgeRecord();
        recipientRecord.setRole("RECIPIENT");
        recipientRecord.setPatientName("Suresh Gupta");
        recipientRecord.setBloodGroup("O+");
        recipientRecord.setOrgan("Kidney");
        recipientRecord.setHospitalId("HOSP-002");

        pendingMatch = new MatchRecord();
        pendingMatch.setStatus("PENDING");

        completedMatch = new MatchRecord();
        completedMatch.setStatus("COMPLETED");
    }

    // ── getPledgesByStatus ───────────────────────────────────────────────────

    @Test
    @DisplayName("getPledgesByStatus returns donors when role is DONOR")
    void getPledgesByStatus_returnsDonors_whenRoleIsDonor() {
        when(pledgeRecordRepository.findByRole("DONOR"))
                .thenReturn(List.of(donorRecord));

        List<PledgeRecord> result = organService.getPledgesByStatus("DONOR");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRole()).isEqualTo("DONOR");
    }

    @Test
    @DisplayName("getPledgesByStatus returns empty list when no matching role")
    void getPledgesByStatus_returnsEmpty_whenNoMatch() {
        when(pledgeRecordRepository.findByRole("UNKNOWN"))
                .thenReturn(Collections.emptyList());

        List<PledgeRecord> result = organService.getPledgesByStatus("UNKNOWN");

        assertThat(result).isEmpty();
    }

    // ── getMatchesByStatus ───────────────────────────────────────────────────

    @Test
    @DisplayName("getMatchesByStatus filters matches by status correctly")
    void getMatchesByStatus_filtersCorrectly() {
        when(matchRecordRepository.findAll())
                .thenReturn(Arrays.asList(pendingMatch, completedMatch));

        List<MatchRecord> pendingResults = organService.getMatchesByStatus("PENDING");
        List<MatchRecord> completedResults = organService.getMatchesByStatus("COMPLETED");

        assertThat(pendingResults).hasSize(1);
        assertThat(pendingResults.get(0).getStatus()).isEqualTo("PENDING");

        assertThat(completedResults).hasSize(1);
        assertThat(completedResults.get(0).getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("getMatchesByStatus returns empty list when no records exist")
    void getMatchesByStatus_returnsEmpty_whenNoRecords() {
        when(matchRecordRepository.findAll()).thenReturn(Collections.emptyList());

        List<MatchRecord> result = organService.getMatchesByStatus("PENDING");

        assertThat(result).isEmpty();
    }

    // ── getPledgesByHospital ─────────────────────────────────────────────────

    @Test
    @DisplayName("getPledgesByHospital returns pledges for given hospital ID")
    void getPledgesByHospital_returnsPledgesForHospital() {
        when(pledgeRecordRepository.findByHospitalId("HOSP-001"))
                .thenReturn(List.of(donorRecord));

        List<PledgeRecord> result = organService.getPledgesByHospital("HOSP-001");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getHospitalId()).isEqualTo("HOSP-001");
    }

    // ── getOrganStats ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getOrganStats returns correct donor, recipient and total counts")
    void getOrganStats_returnsCorrectCounts() {
        when(pledgeRecordRepository.findAll())
                .thenReturn(Arrays.asList(donorRecord, donorRecord, recipientRecord));

        Map<String, Long> stats = organService.getOrganStats();

        assertThat(stats.get("donors")).isEqualTo(2L);
        assertThat(stats.get("recipients")).isEqualTo(1L);
        assertThat(stats.get("total")).isEqualTo(3L);
    }

    @Test
    @DisplayName("getOrganStats returns zero counts when repository is empty")
    void getOrganStats_returnsZeroCounts_whenEmpty() {
        when(pledgeRecordRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Long> stats = organService.getOrganStats();

        assertThat(stats.get("donors")).isEqualTo(0L);
        assertThat(stats.get("recipients")).isEqualTo(0L);
        assertThat(stats.get("total")).isEqualTo(0L);
    }

    // ── verifyOrganStatus ────────────────────────────────────────────────────

    @Test
    @DisplayName("verifyOrganStatus returns true when pledge has a non-null role")
    void verifyOrganStatus_returnsTrue_whenRoleIsPresent() {
        when(pledgeRecordRepository.findById(1L))
                .thenReturn(Optional.of(donorRecord));

        boolean result = organService.verifyOrganStatus(1L);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("verifyOrganStatus returns false when pledge does not exist")
    void verifyOrganStatus_returnsFalse_whenPledgeNotFound() {
        when(pledgeRecordRepository.findById(99L))
                .thenReturn(Optional.empty());

        boolean result = organService.verifyOrganStatus(99L);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("verifyOrganStatus returns false when pledge has null role")
    void verifyOrganStatus_returnsFalse_whenRoleIsNull() {
        PledgeRecord noRoleRecord = new PledgeRecord();
        noRoleRecord.setRole(null);
        when(pledgeRecordRepository.findById(2L))
                .thenReturn(Optional.of(noRoleRecord));

        boolean result = organService.verifyOrganStatus(2L);

        assertThat(result).isFalse();
    }

    // ── countByStatus ────────────────────────────────────────────────────────

    @Test
    @DisplayName("countByStatus returns correct count for given role")
    void countByStatus_returnsCorrectCount() {
        when(pledgeRecordRepository.findByRole("DONOR"))
                .thenReturn(Arrays.asList(donorRecord, donorRecord));

        long count = organService.countByStatus("DONOR");

        assertThat(count).isEqualTo(2L);
    }

    @Test
    @DisplayName("countByStatus returns zero when no records match")
    void countByStatus_returnsZero_whenNoMatch() {
        when(pledgeRecordRepository.findByRole("RECIPIENT"))
                .thenReturn(Collections.emptyList());

        long count = organService.countByStatus("RECIPIENT");

        assertThat(count).isEqualTo(0L);
    }
}
