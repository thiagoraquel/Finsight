package br.ufrn.academix.framework.core.files;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentExtractorStrategy {
    
    /**
     * Verifica se esta estratégia sabe lidar com a extensão fornecida.
     */
    boolean supports(String extension);

    /**
     * Extrai o conteúdo bruto do arquivo e devolve como texto.
     */
    String extractText(MultipartFile file);
}