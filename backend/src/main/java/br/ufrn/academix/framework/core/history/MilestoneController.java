package br.ufrn.academix.framework.core.history;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/core/milestones")
@CrossOrigin(origins = "http://localhost:3000") // Pode restringir isso depois se quiser
public class MilestoneController {

    private final MilestoneService service;

    public MilestoneController(MilestoneService service) {
        this.service = service;
    }

    @PostMapping("/{accountId}")
    public ResponseEntity<MilestoneResponseDTO> addMilestone(
            @PathVariable UUID accountId, 
            @RequestBody MilestoneRequestDTO dto) {
        try {
            MilestoneResponseDTO saved = service.registerMilestone(accountId, dto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<MilestoneResponseDTO>> getTimeline(@PathVariable UUID accountId) {
        return ResponseEntity.ok(service.getTimeline(accountId));
    }
}