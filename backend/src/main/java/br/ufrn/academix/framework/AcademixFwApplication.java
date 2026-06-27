package br.ufrn.academix.framework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class AcademixFwApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcademixFwApplication.class, args);
	}

	// Ensina o Spring a criar o RestTemplate para ser injetado no GeminiLlmClient
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
