package br.ufrn.academix.framework.core.history;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MilestoneService {

    private final MilestoneRepository repository;

    public MilestoneService(MilestoneRepository repository) {
        this.repository = repository;
    }

    public MilestoneResponseDTO registerMilestone(UUID accountId, MilestoneRequestDTO dto) {
        Milestone milestone = new Milestone();
        milestone.setAccountId(accountId);
        milestone.setReferenceYear(dto.referenceYear());
        milestone.setCategory(dto.category());
        milestone.setTitle(dto.title());
        milestone.setDescription(dto.description());

        Milestone saved = repository.save(milestone);

        return new MilestoneResponseDTO(
                saved.getId(), saved.getReferenceYear(), 
                saved.getCategory(), saved.getTitle(), saved.getDescription()
        );
    }

    public List<MilestoneResponseDTO> getTimeline(UUID accountId) {
        return repository.findByAccountIdOrderByReferenceYearDesc(accountId).stream()
                .map(m -> new MilestoneResponseDTO(
                        m.getId(), m.getReferenceYear(), 
                        m.getCategory(), m.getTitle(), m.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public List<MilestoneResponseDTO> getChronologicalTimeline(UUID accountId) {
        return repository.findByAccountIdOrderByReferenceYearAsc(accountId).stream()
                .map(m -> new MilestoneResponseDTO(
                        m.getId(), m.getReferenceYear(), 
                        m.getCategory(), m.getTitle(), m.getDescription()
                ))
                .collect(Collectors.toList());
    }
}