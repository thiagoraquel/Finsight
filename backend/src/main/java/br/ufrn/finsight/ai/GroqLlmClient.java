package br.ufrn.finsight.ai;

import br.ufrn.academix.framework.core.ai.LlmClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class GroqLlmClient implements LlmClient {

    @Value("${finsight.groq.api-key}")
    private String apiKey;

    @Value("${finsight.groq.api-url}")
    private String apiUrl;

    @Value("${finsight.groq.model}")
    private String model;

    private final RestTemplate restTemplate;

    public GroqLlmClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String generateResponse(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // O prompt completo montado pelo Template Method entra aqui como a mensagem do usuário
        GroqRequest requestBody = new GroqRequest(
                model,
                List.of(new Message("user", prompt))
        );

        HttpEntity<GroqRequest> entity = new HttpEntity<>(requestBody, headers);

        try {
            GroqResponse response = restTemplate.postForObject(apiUrl, entity, GroqResponse.class);
            if (response != null && response.choices() != null && !response.choices().isEmpty()) {
                return response.choices().get(0).message().content();
            }
            return "Nenhuma resposta retornada pelo motor Groq.";
        } catch (Exception e) {
            throw new RuntimeException("Erro na inferência com o Groq: " + e.getMessage());
        }
    }

    // Records auxiliares internos para o mapeamento JSON
    private record Message(String role, String content) {}
    private record GroqRequest(String model, List<Message> messages) {}
    private record Choice(Message message) {}
    private record GroqResponse(List<Choice> choices) {}
}