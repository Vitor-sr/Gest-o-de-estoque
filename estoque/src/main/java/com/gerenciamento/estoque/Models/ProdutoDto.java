package com.gerenciamento.estoque.Models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;

public class ProdutoDto {
    @NotEmpty(message = "Nome necessario")
    private String nome;
    @Min(0)
    private BigDecimal preco;
    @Min(0)
    private int estoque;

    /**
     * @return the nome
     */
    public String getNome() {
        return nome;
    }

    /**
     * @param nome the nome to set
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * @return the preco
     */
    public BigDecimal getPreco() {
        return preco;
    }

    /**
     * @param preco the preco to set
     */
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    /**
     * @return the estoque
     */
    public int getEstoque() {
        return estoque;
    }

    /**
     * @param estoque the estoque to set
     */
    public void setEstoque(int estoque) {
        this.estoque = estoque;
    }
}
