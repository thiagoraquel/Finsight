package br.ufrn.finsight.api.dto;

public record LoginRequestDTO(
    String email,
    String senha
) {}