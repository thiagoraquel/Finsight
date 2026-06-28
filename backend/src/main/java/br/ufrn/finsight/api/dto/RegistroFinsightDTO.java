package br.ufrn.finsight.api.dto;

import lombok.Builder;

@Builder
public record RegistroFinsightDTO(
    String nome,
    String email,
    String senha,
    String investorId,
    String riskProfile
) {}