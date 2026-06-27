package br.ufrn.academix.framework.core.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FrameworkAccountRepository extends JpaRepository<FrameworkAccount, UUID> {
}