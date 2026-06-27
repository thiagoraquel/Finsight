package br.ufrn.academix.framework.core.history;

import java.util.UUID;

public record MilestoneResponseDTO(
    UUID id,
    Integer referenceYear,
    String category,
    String title,
    String description
) {}