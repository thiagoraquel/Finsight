package br.ufrn.finsight.api.dto;

import java.util.UUID;

public record FinsightProfileResponseDTO(
    UUID id,
    String investorId,
    String riskProfile,
    AccountResponseDTO account
) {}