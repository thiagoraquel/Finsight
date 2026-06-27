package br.ufrn.academix.framework.core.ai;

public interface LlmClient {
    /**
     * Recebe um prompt final já montado e retorna a resposta da LLM.
     */
    String generateResponse(String prompt);
}