package br.ufrn.finsight.api.controller;

import br.ufrn.finsight.api.dto.AtivoGraficoDTO;
import br.ufrn.finsight.api.dto.FinsightProfileResponseDTO;
import br.ufrn.finsight.api.dto.AccountResponseDTO;
import br.ufrn.finsight.api.dto.LoginRequestDTO;
import br.ufrn.finsight.api.dto.RegistroFinsightDTO;
import br.ufrn.finsight.domain.model.FinsightProfile;
import br.ufrn.finsight.service.FinsightProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class FinsightProfileController {

    private final FinsightProfileService profileService;

    public FinsightProfileController(FinsightProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/registro")
    public ResponseEntity<FinsightProfileResponseDTO> registrar(@RequestBody RegistroFinsightDTO dto) {
        FinsightProfile profile = profileService.registrar(dto);
        return ResponseEntity.ok(mapearParaDTO(profile));
    }

    @PostMapping("/login")
    public ResponseEntity<FinsightProfileResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return profileService.autenticar(dto.email(), dto.senha())
                .map(profile -> ResponseEntity.ok(mapearParaDTO(profile)))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/{id}/upload-carteira")
    public ResponseEntity<String> uploadCarteira(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        try {
            profileService.salvarPlanilhaExcel(id, file);
            return ResponseEntity.ok("Planilha de investimentos processada e salva com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao processar planilha: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/grafico")
    public ResponseEntity<List<AtivoGraficoDTO>> obterDadosGrafico(@PathVariable UUID id) {
        List<AtivoGraficoDTO> dados = profileService.obterDadosParaGrafico(id);
        if (dados.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dados);
    }

    // Método utilitário para converter a Entidade no DTO esperado pelo Front-end
    private FinsightProfileResponseDTO mapearParaDTO(FinsightProfile profile) {
        AccountResponseDTO accountDTO = new AccountResponseDTO(
                profile.getAccount().getId(),
                profile.getAccount().getName(),
                profile.getAccount().getEmail()
        );
        return new FinsightProfileResponseDTO(
                profile.getId(),
                profile.getInvestorId(),
                profile.getRiskProfile(),
                accountDTO
        );
    }
}