package br.ufrn.finsight.service;

import br.ufrn.academix.framework.core.files.DocumentExtractorStrategy;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

@Service // Vira um componente elegível para a lista do Spring
public class FinsightExcelExtractor implements DocumentExtractorStrategy {

    @Override
    public boolean supports(String extension) {
        return "xlsx".equals(extension) || "xls".equals(extension);
    }

    @Override
    public String extractText(MultipartFile file) {
        StringBuilder carteiraExtraida = new StringBuilder();
        carteiraExtraida.append("Ativo,Categoria,Valor(R$)\n");

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String ativo = obterValorDaCelula(row.getCell(0));
                String categoria = obterValorDaCelula(row.getCell(1));
                String valor = obterValorDaCelula(row.getCell(2));

                if (!ativo.isBlank() && !valor.isBlank()) {
                    carteiraExtraida.append(ativo).append(",")
                                    .append(categoria).append(",")
                                    .append(valor).append("\n");
                }
            }
            return carteiraExtraida.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar Excel: " + e.getMessage());
        }
    }

    private String obterValorDaCelula(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            default -> "";
        };
    }
}