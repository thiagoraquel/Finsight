package br.ufrn.finsight.api.dto;

import lombok.Builder;

@Builder
public record AtivoGraficoDTO(
    String categoria,
    Double valorTotal
) {}