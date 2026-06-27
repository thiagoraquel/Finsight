package br.ufrn.academix.framework.core.history;

public record MilestoneRequestDTO(
    Integer referenceYear,
    String category, // Ex: "Curso" no Academix, "Aporte" no FinSight
    String title,
    String description
) {}