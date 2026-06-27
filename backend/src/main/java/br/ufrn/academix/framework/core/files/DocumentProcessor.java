package br.ufrn.academix.framework.core.files;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class DocumentProcessor {

    // O Spring injeta automaticamente TODAS as implementações de DocumentExtractorStrategy ativas no projeto
    private final List<DocumentExtractorStrategy> extractors;

    public DocumentProcessor(List<DocumentExtractorStrategy> extractors) {
        this.extractors = extractors;
    }

    public String processFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }

        String extension = getFileExtension(file.getOriginalFilename());

        // Procura na lista a estratégia que sabe lidar com a extensão
        for (DocumentExtractorStrategy strategy : extractors) {
            if (strategy.supports(extension)) {
                return strategy.extractText(file);
            }
        }

        throw new UnsupportedOperationException("O formato de arquivo '." + extension + "' não é suportado pelo sistema no momento.");
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
}