package br.ufrn.academix.framework.core.files;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@Component
public class TxtExtractorStrategy implements DocumentExtractorStrategy {

    @Override
    public boolean supports(String extension) {
        return "txt".equalsIgnoreCase(extension);
    }

    @Override
    public String extractText(MultipartFile file) {
        try {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao ler o arquivo TXT: " + e.getMessage(), e);
        }
    }
}