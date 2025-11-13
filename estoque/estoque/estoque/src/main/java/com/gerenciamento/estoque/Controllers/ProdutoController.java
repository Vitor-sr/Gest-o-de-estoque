package com.gerenciamento.estoque.Controllers;

import com.gerenciamento.estoque.Models.ProdutoDto;
import com.gerenciamento.estoque.services.ProdutoRepository;
import com.gerenciamento.estoque.Models.Produto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/produtos")
public class ProdutoController {


    @Autowired
    private ProdutoRepository repo;

    @GetMapping({"", "/"})
    public String showProdutoLista(Model model) { // 3. Parâmetro 'Model' adicionado e tipo de retorno 'String'
        List<Produto> produtos = repo.findAll();
        model.addAttribute("produtos", produtos);
        return "produtos/index";
    }

    @GetMapping("/criar")
    public String MostarCriarProduto(Model model) {
        ProdutoDto produtoDto = new ProdutoDto();
        model.addAttribute("produtoDto", produtoDto);
        return "produtos/CriarProduto";
    }


    @PostMapping("/criar")
    public String criarProduto(
            @Valid @ModelAttribute ProdutoDto produtoDto,
            BindingResult result
    ) {

        //validações
        Produto produto = new Produto();
        produto.setNome(produtoDto.getNome());
        produto.setEstoque(produtoDto.getEstoque());
        produto.setPreco(produtoDto.getPreco());
        repo.save(produto);
        return "redirect:/produtos";
    }

    /**
     * @return the repo
     */
    public ProdutoRepository getRepo() {
        return repo;
    }

    /**
     * @param repo the repo to set
     */
    public void setRepo(ProdutoRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/alterar/{id}")
    public String mostrarAlterarProduto(@PathVariable String id, Model model) {
        try {
            // Busca o produto
            Produto produto = repo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));

            // Cria DTO e preenche
            ProdutoDto produtoDto = new ProdutoDto();
            produtoDto.setNome(produto.getNome());
            produtoDto.setPreco(produto.getPreco());
            produtoDto.setEstoque(produto.getEstoque());

            // Adiciona ao model
            model.addAttribute("produtoId", id);
            model.addAttribute("produto", produto);
            model.addAttribute("produtoDto", produtoDto);

            return "produtos/AlterarProduto";
        } catch (Exception ex) {
            System.out.println("Erro: " + ex.getMessage());
            return "redirect:/produtos";
        }
    }

    @PostMapping("/alterar/{id}")
    public String alterarProduto(
                                  @PathVariable String id,
                                  @Valid @ModelAttribute ProdutoDto produtoDto,
                                  BindingResult result,
                                  Model model
    ){

        if (result.hasErrors()) {
            model.addAttribute("produtoId", id);
            model.addAttribute("produtoDto", produtoDto);
            return "produtos/AlterarProduto";
        }

        // Lógica de Persistência (Exemplo):
        try {
            // Busca o produto existente
            Produto produto = repo.findById(id).orElseThrow(
                    () -> new RuntimeException("Produto não encontrado para alteração")
            );

            produto.setNome(produtoDto.getNome());
            produto.setEstoque(produtoDto.getEstoque());
            produto.setPreco(produtoDto.getPreco());

            repo.save(produto);

        } catch (Exception e) {
            model.addAttribute("errorMessage", "Erro ao salvar: " + e.getMessage());
            model.addAttribute("produtoId", id);
            model.addAttribute("produtoDto", produtoDto);
            return "produtos/AlterarProduto";
        }

        return "redirect:/produtos";
    }
    @GetMapping("/excluir")
    public String MostrarExcluirProduto(@RequestParam String id){
        try{
            Produto produto = repo.findById(id).orElseThrow(
                    () -> new RuntimeException("Produto não encontrado para alteração")
            );
            repo.deleteById(id);
        }catch (Exception ex){
            System.out.println("Erro ao excluir: " + ex.getMessage());
        }
        repo.deleteAll();
        return "redirect:/produtos";
    }

    @PostMapping("/excluir/{id}")
    public String excluirProduto(@PathVariable String id) {
        try {
            repo.deleteById(id);
        } catch (Exception e) {
            System.err.println("Erro ao excluir produto: " + e.getMessage());
        }
        return "redirect:/produtos";
    }
}


