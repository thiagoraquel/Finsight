package br.ufrn.finsight.service;

import br.ufrn.academix.framework.core.ai.AiTaskTemplate;
import br.ufrn.academix.framework.core.history.MilestoneService;
import br.ufrn.finsight.ai.GroqLlmClient;
import br.ufrn.finsight.domain.model.FinsightProfile;
import br.ufrn.finsight.domain.repository.FinsightProfileRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnaliseCarteiraTask extends AiTaskTemplate {

    private final FinsightProfileRepository profileRepository;

    // Injetamos explicitamente o GroqLlmClient para passá-lo ao construtor do framework
    public AnaliseCarteiraTask(
            GroqLlmClient groqLlmClient, 
            MilestoneService milestoneService,
            FinsightProfileRepository profileRepository) {
        super(groqLlmClient, milestoneService);
        this.profileRepository = profileRepository;
    }

    @Override
    protected String getSystemPersona() {
        return "Você é o Analista Financeiro Inteligente do sistema FinSight. " +
               "Seu tom deve ser técnico, preciso, focado em alocação de ativos e gerenciamento de risco.";
    }

    @Override
    protected String extractProfileData(UUID accountId) {
        // Resgata o CSV gerado a partir da planilha de Excel do usuário
        return profileRepository.findByAccountId(accountId)
                .map(FinsightProfile::getPlanilhaDadosTexto)
                .orElse("Nenhuma planilha de investimentos foi enviada para esta conta até o momento.");
    }

    @Override
    protected boolean shouldIncludeMilestones() {
        // Queremos incluir a linha do tempo de conquistas financeiras para contextualizar o momento do investidor
        return true;
    }

    @Override
    protected String getEvaluationCriteria() {
        return "Examine os ativos da planilha (Dados da Entidade) e o histórico de aportes e metas (Marcos).\n" +
               "1. Identifique riscos de concentração excessiva em ativos específicos ou setores.\n" +
               "2. Avalie o alinhamento da carteira atual com os marcos históricos atingidos.\n" +
               "3. Se houver um documento de referência (ex: PDF com fatos relevantes ou relatórios de mercado) ou mensagem direta, responda de forma consultiva.\n" +
               "4. Forneça 3 recomendações de rebalanceamento focadas em preservação de capital e diversificação.";
    }
}