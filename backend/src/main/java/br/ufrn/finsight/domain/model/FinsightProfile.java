package br.ufrn.finsight.domain.model;

import br.ufrn.academix.framework.core.auth.FrameworkAccount;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "finsight_profiles")
@Getter
@Setter
public class FinsightProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // A ligação universal com o framework
    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "account_id", unique = true)
    private FrameworkAccount account;

    // Campos específicos do domínio financeiro
    private String investorId; // Ex: Código na CVM ou B3
    private String riskProfile; // Conservador, Moderado, Arrojado
    
    // Espaço para a persona criadora de conteúdo do usuário
    private String educationalChannelName; // Ex: "Monki Makes Money"
    
    // Aqui salvaremos o texto extraído do Excel para alimentar a IA
    @Column(name = "planilha_dados_texto", columnDefinition = "TEXT")
    private String planilhaDadosTexto;
}