package br.ufrn.academix.framework.core.auth;

import java.util.UUID;

public interface BusinessIdentifierProvider {
    /**
     * O framework passa o ID da conta base e a aplicação devolve o identificador de negócio (ex: Lattes ID).
     */
    String getIdentifierForAccount(UUID accountId);
}