package br.ufrn.academix.framework.core.history;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "framework_milestones")
@Getter
@Setter
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Referência "solta" para a conta, mantendo o core desacoplado do app
    @Column(nullable = false)
    private UUID accountId; 

    private Integer referenceYear; // O "ano" da sua Fase 1
    private String category;       // O "tipo" da sua Fase 1 (Curso, Projeto, etc)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();
}