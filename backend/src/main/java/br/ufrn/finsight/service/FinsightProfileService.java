package br.ufrn.finsight.service;

import br.ufrn.academix.framework.core.auth.FrameworkAccount;
import br.ufrn.academix.framework.core.auth.FrameworkAccountRepository;
import br.ufrn.academix.framework.core.files.DocumentProcessor;
import br.ufrn.finsight.api.dto.AtivoGraficoDTO;
import br.ufrn.finsight.api.dto.RegistroFinsightDTO;
import br.ufrn.finsight.domain.model.FinsightProfile;
import br.ufrn.finsight.domain.repository.FinsightProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FinsightProfileService {

    private final FinsightProfileRepository profileRepository;
    private final FrameworkAccountRepository accountRepository;
    private final DocumentProcessor documentProcessor;

    public FinsightProfileService(FinsightProfileRepository profileRepository, 
                                  FrameworkAccountRepository accountRepository, 
                                  DocumentProcessor documentProcessor) {
        this.profileRepository = profileRepository;
        this.accountRepository = accountRepository;
        this.documentProcessor = documentProcessor;
    }

    public FinsightProfile registrar(RegistroFinsightDTO dto) {
        if (accountRepository.findAll().stream().anyMatch(a -> a.getEmail().equals(dto.email()))) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        // 1. Cria a Conta no Framework
        FrameworkAccount account = new FrameworkAccount();
        account.setName(dto.nome());
        account.setEmail(dto.email());
        account.setPassword(dto.senha());

        // 2. Cria o Perfil Financeiro
        FinsightProfile profile = new FinsightProfile();
        profile.setAccount(account);
        profile.setInvestorId(dto.investorId());
        profile.setRiskProfile(dto.riskProfile());

        return profileRepository.save(profile);
    }

    public Optional<FinsightProfile> autenticar(String email, String senha) {
        return profileRepository.findByAccountEmail(email)
                .filter(p -> p.getAccount().getPassword().equals(senha));
    }

    // Processa a planilha do Excel usando o roteador dinâmico do Framework
    public void salvarPlanilhaExcel(UUID profileId, MultipartFile arquivo) {
        FinsightProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado."));

        // O Framework vai descobrir sozinho que é um Excel (.xlsx) e chamar o seu FinsightExcelProcessor
        String conteudoPlanilha = documentProcessor.processFile(arquivo);
        
        profile.setPlanilhaDadosTexto(conteudoPlanilha);
        profileRepository.save(profile);
    }

    // Pega o CSV do banco e transforma em DTO para o gráfico do frontend
    public List<AtivoGraficoDTO> obterDadosParaGrafico(UUID profileId) {
        FinsightProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado."));

        String textoBanco = profile.getPlanilhaDadosTexto();
        if (textoBanco == null || textoBanco.isBlank()) {
            return List.of(); // Retorna lista vazia se não houver planilha
        }

        Map<String, Double> somaPorCategoria = new HashMap<>();

        // Quebra o texto por linhas (\n)
        String[] linhas = textoBanco.split("\n");
        
        // Pula a linha 0 porque é o cabeçalho ("Ativo,Categoria,Valor")
        for (int i = 1; i < linhas.length; i++) {
            String linha = linhas[i];
            if (linha.isBlank()) continue;

            String[] colunas = linha.split(",");
            if (colunas.length >= 3) {
                String categoria = colunas[1].trim();
                try {
                    Double valor = Double.parseDouble(colunas[2].trim());
                    somaPorCategoria.put(categoria, somaPorCategoria.getOrDefault(categoria, 0.0) + valor);
                } catch (NumberFormatException e) {
                    // Ignora a linha se o usuário digitou letras no lugar de valores
                }
            }
        }

        // Converte o Mapa (Categoria -> Total) na lista de DTOs
        return somaPorCategoria.entrySet().stream()
                .map(entry -> AtivoGraficoDTO.builder()
                        .categoria(entry.getKey())
                        .valorTotal(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}