package br.ufrn.academix.framework.core.ai;

import br.ufrn.academix.framework.core.history.MilestoneResponseDTO;
import br.ufrn.academix.framework.core.history.MilestoneService;

import java.util.List;
import java.util.UUID;

public abstract class AiTaskTemplate {

    private final LlmClient llmClient;
    private final MilestoneService milestoneService;

    // O serviço de Milestones agora faz parte da injeção base do Template
    public AiTaskTemplate(LlmClient llmClient, MilestoneService milestoneService) {
        this.llmClient = llmClient;
        this.milestoneService = milestoneService;
    }

    public final String executeTask(UUID accountId, String documentText, String userMessage) {
        StringBuilder promptBuilder = new StringBuilder();

        // 1. Injeta a Persona
        promptBuilder.append(getSystemPersona()).append("\n\n");

        // 2. Dados Estáticos do Perfil (Ex: Currículo)
        String profileData = extractProfileData(accountId);
        if (profileData != null && !profileData.isBlank()) {
            promptBuilder.append("=== DADOS DA ENTIDADE (BASE DE DADOS) ===\n");
            promptBuilder.append(profileData).append("\n\n");
        }

        // 3. Dados Dinâmicos (Milestones em Ordem Cronológica)
        if (shouldIncludeMilestones()) {
            List<MilestoneResponseDTO> milestones = milestoneService.getChronologicalTimeline(accountId);
            if (milestones != null && !milestones.isEmpty()) {
                promptBuilder.append("=== HISTÓRICO & MARCOS DA ENTIDADE (ORDEM CRONOLÓGICA) ===\n");
                for (MilestoneResponseDTO m : milestones) {
                    promptBuilder.append(String.format("- [%d] %s: %s", m.referenceYear(), m.category(), m.title()));
                    if (m.description() != null && !m.description().isBlank()) {
                        promptBuilder.append(" | Detalhes: ").append(m.description());
                    }
                    promptBuilder.append("\n");
                }
                promptBuilder.append("\n");
            }
        }

        // 4. Documento Anexado
        if (documentText != null && !documentText.isBlank()) {
            promptBuilder.append("=== DOCUMENTO DE REFERÊNCIA ===\n");
            promptBuilder.append(documentText).append("\n\n");
        }

        // 5. Pergunta do Usuário
        if (userMessage != null && !userMessage.isBlank()) {
            promptBuilder.append("=== SOLICITAÇÃO DO USUÁRIO ===\n");
            promptBuilder.append(userMessage).append("\n\n");
        }

        // 6. Critério de Avaliação
        promptBuilder.append("=== CRITÉRIO DE AVALIAÇÃO / DIRECIONAMENTO ===\n");
        promptBuilder.append(getEvaluationCriteria());

        return llmClient.generateResponse(promptBuilder.toString());
    }

    // --- PONTOS VARIÁVEIS (Hooks) ---
    protected abstract String getSystemPersona();
    
    // Retorne null ou string vazia caso não queira os dados base
    protected abstract String extractProfileData(UUID accountId);
    
    // Retorne true se quiser injetar a linha do tempo, false caso contrário
    protected abstract boolean shouldIncludeMilestones(); 
    
    protected abstract String getEvaluationCriteria();
}