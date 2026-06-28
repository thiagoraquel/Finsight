package br.ufrn.finsight.domain.repository;

import br.ufrn.finsight.domain.model.FinsightProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface FinsightProfileRepository extends JpaRepository<FinsightProfile, UUID> {
    
    // O método otimizado de ponte entre App e Core
    Optional<FinsightProfile> findByAccountId(UUID accountId);

    Optional<FinsightProfile> findByAccountEmail(String email);
}