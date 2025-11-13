package com.gerenciamento.estoque.Controllers;

import com.gerenciamento.estoque.Models.SolicitacaoCompra;
import com.gerenciamento.estoque.services.ProdutoRepository;
import com.gerenciamento.estoque.services.SolicitacaoCompraRepository;
import com.gerenciamento.estoque.services.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoCompraRepository solicitacaoCompraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    // Exibir formulário de nova solicitação
    @GetMapping("/novo")
    public String novaSolicitacao(Model model) {
        model.addAttribute("produtos", produtoRepository.findAll());
        model.addAttribute("solicitacao", new SolicitacaoCompra());
        return "/solicitacoes/novo"; // Caminho correto para Thymeleaf
    }

    // Salvar solicitação
    @PostMapping("/salvar")
    public String salvarSolicitacao(@ModelAttribute SolicitacaoCompra solicitacao) {
        if (solicitacao.getItens() != null) {
            solicitacao.getItens().forEach(item -> item.setSolicitacaoCompra(solicitacao));
        }
        solicitacaoCompraRepository.save(solicitacao);
        return "redirect:/solicitacoes/listar";
    }

    // Listar todas as solicitações
    @GetMapping("/listar")
    public String listarSolicitacoes(Model model) {
        List<SolicitacaoCompra> solicitacoes = solicitacaoCompraRepository.findAll();
        model.addAttribute("solicitacoes", solicitacoes);
        return "solicitacoes/listar"; // Caminho correto para o template na subpasta
    }

    // Aprovar solicitação
    @PostMapping("/aprovar/{id}")
    public String aprovarSolicitacao(@PathVariable UUID id) {
        SolicitacaoCompra sol = solicitacaoCompraRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação inválida: " + id));
        sol.setStatus(SolicitacaoCompra.Status.APROVADA);
        solicitacaoCompraRepository.save(sol);
        return "redirect:/solicitacoes/listar";
    }

    // Rejeitar solicitação
    @PostMapping("/rejeitar/{id}")
    public String rejeitarSolicitacao(@PathVariable UUID id) {
        SolicitacaoCompra sol = solicitacaoCompraRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação inválida: " + id));
        sol.setStatus(SolicitacaoCompra.Status.REJEITADA);
        solicitacaoCompraRepository.save(sol);
        return "redirect:/solicitacoes/listar";
    }
}
