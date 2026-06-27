package br.ufrn.academix.framework.core.files;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@Component
public class XmlExtractorStrategy implements DocumentExtractorStrategy {

    @Override
    public boolean supports(String extension) {
        return "xml".equalsIgnoreCase(extension);
    }

    @Override
    public String extractText(MultipartFile file) {
        try {
            // Como a IA só precisa do texto bruto, a extração simples em String costuma ser suficiente,
            // mas o programador da aplicação poderá formatar o XML posteriormente.
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao ler o arquivo XML: " + e.getMessage(), e);
        }
    }
}