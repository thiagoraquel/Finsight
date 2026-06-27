package br.ufrn.academix.framework.core.files;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;

@Component
public class PdfExtractorStrategy implements DocumentExtractorStrategy {

    @Override
    public boolean supports(String extension) {
        return "pdf".equalsIgnoreCase(extension);
    }

    @Override
    public String extractText(MultipartFile file) {
        // Mudança aqui: Usando Loader.loadPDF com os bytes do arquivo
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Trava de segurança para não estourar o limite de tokens da LLM
            if (text != null && text.length() > 20000) {
                return text.substring(0, 20000);
            }
            return text;

        } catch (Exception e) {
            throw new RuntimeException("Não foi possível ler o arquivo PDF. Certifique-se de que é um documento válido. Detalhes: " + e.getMessage(), e);
        }
    }
}