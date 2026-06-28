package br.ufrn.finsight.service;

import br.ufrn.finsight.domain.model.FinsightProfile;
import br.ufrn.finsight.domain.repository.FinsightProfileRepository;
import br.ufrn.academix.framework.core.auth.BusinessIdentifierProvider;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FinsightIdentifierProvider implements BusinessIdentifierProvider {

    private final FinsightProfileRepository repository;

    public FinsightIdentifierProvider(FinsightProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getIdentifierForAccount(UUID accountId) {
        // Já usando a boa prática de performance que discutimos!
        return repository.findByAccountId(accountId)
                .map(FinsightProfile::getInvestorId)
                .orElseThrow(() -> new RuntimeException("Perfil de investidor não encontrado."));
    }
}