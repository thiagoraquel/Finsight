package br.ufrn.finsight.api.dto;

import java.util.UUID;

public record AccountResponseDTO(
    UUID id,
    String name,
    String email
) {}