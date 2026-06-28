package br.ufrn.finsight.api.controller;

import br.ufrn.finsight.service.AnaliseCarteiraTask;
import br.ufrn.academix.framework.core.files.DocumentProcessor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiFinsightController {

    private final AnaliseCarteiraTask analiseTask;
    private final DocumentProcessor documentProcessor;

    public AiFinsightController(AnaliseCarteiraTask analiseTask, DocumentProcessor documentProcessor) {
        this.analiseTask = analiseTask;
        this.documentProcessor = documentProcessor;
    }

    // Rota para o botão "Conselho Rápido" (JSON)
    @PostMapping("/conselho/rapido/{accountId}")
    public ResponseEntity<String> conselhoRapido(
            @PathVariable UUID accountId,
            @RequestBody Map<String, String> payload) {
        try {
            String mensagem = payload.get("mensagem");
            String respostaIA = analiseTask.executeTask(accountId, null, mensagem);
            return ResponseEntity.ok(respostaIA);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro no motor de IA FinSight: " + e.getMessage());
        }
    }

    // Rota para o Chat (FormData), suportando anexos de mercado adicionais processados pelo Core
    @PostMapping("/conselho/{accountId}")
    public ResponseEntity<String> conselhoComArquivo(
            @PathVariable UUID accountId,
            @RequestParam("mensagem") String mensagem,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            String documentText = "";
            if (file != null && !file.isEmpty()) {
                documentText = documentProcessor.processFile(file);
            }
            
            String respostaIA = analiseTask.executeTask(accountId, documentText, mensagem);
            return ResponseEntity.ok(respostaIA);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro no processamento do motor de IA: " + e.getMessage());
        }
    }
}