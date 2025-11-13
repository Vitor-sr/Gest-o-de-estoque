package com.gerenciamento.estoque.Controllers;

import com.gerenciamento.estoque.Models.Usuario;
import com.gerenciamento.estoque.Models.GrupoUsuario;
import com.gerenciamento.estoque.services.UsuarioRepository;
import com.gerenciamento.estoque.services.GrupoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class FuncionarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GrupoUsuarioRepository grupoUsuarioRepository;

    // ✅ LISTAR
    @GetMapping("/funcionarios")
    public String listarFuncionarios(Model model) {
        List<Usuario> funcionarios = usuarioRepository.findAll();
        model.addAttribute("funcionarios", funcionarios);
        return "funcionarios/listaFuncionarios";
    }

    // ✅ FORMULÁRIO DE CRIAÇÃO
    @GetMapping("/funcionarios/novo")
    public String novoFuncionario(Model model) {
        model.addAttribute("funcionario", new Usuario());
        model.addAttribute("grupos", grupoUsuarioRepository.findAll());
        return "funcionarios/novoFuncionario";
    }

    // ✅ SALVAR NOVO FUNCIONÁRIO
    @PostMapping("/funcionarios/salvar")
    public String salvarFuncionario(@ModelAttribute("funcionario") Usuario funcionario) {
        if (funcionario.getGrupo() != null && funcionario.getGrupo().getGrupoId() != null) {
            GrupoUsuario grupo = grupoUsuarioRepository.findById(funcionario.getGrupo().getGrupoId()).orElse(null);
            funcionario.setGrupo(grupo);
        } else {
            funcionario.setGrupo(null);
        }

        usuarioRepository.save(funcionario);
        return "redirect:/funcionarios";
    }

    // ✅ EDITAR
    @GetMapping("/funcionarios/editar/{id}")
    public String editarFuncionario(@PathVariable("id") String id, Model model) {
        Usuario funcionario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário inválido: " + id));

        List<GrupoUsuario> grupos = grupoUsuarioRepository.findAll();
        model.addAttribute("funcionario", funcionario);
        model.addAttribute("grupos", grupos);
        return "funcionarios/editarFuncionario";
    }

    @PostMapping("/funcionarios/atualizar")
    public String atualizarFuncionario(@ModelAttribute("funcionario") Usuario funcionario) {
        Usuario existente = usuarioRepository.findById(funcionario.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Funcionário inválido: " + funcionario.getUsuarioId()));

        existente.setNome(funcionario.getNome());
        existente.setEmail(funcionario.getEmail());

        if (funcionario.getGrupo() != null && funcionario.getGrupo().getGrupoId() != null) {
            GrupoUsuario grupoReal = grupoUsuarioRepository.findById(funcionario.getGrupo().getGrupoId()).orElse(null);
            existente.setGrupo(grupoReal);
        } else {
            existente.setGrupo(null);
        }

        usuarioRepository.save(existente);
        return "redirect:/funcionarios";
    }

    // ✅ EXCLUIR
    @GetMapping("/funcionarios/excluir/{id}")
    public String excluirFuncionario(@PathVariable("id") String id) {
        usuarioRepository.deleteById(id);
        return "redirect:/funcionarios";
    }
}
