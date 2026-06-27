package br.ufrn.academix.framework.core.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    // Usado pela interface gráfica (do mais novo pro mais velho)
    List<Milestone> findByAccountIdOrderByReferenceYearDesc(UUID accountId);

    // NOVA CONSULTA: Usado pelo Motor de IA (ordem cronológica: mais velho pro mais novo)
    List<Milestone> findByAccountIdOrderByReferenceYearAsc(UUID accountId);
}