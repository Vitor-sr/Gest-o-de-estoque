package com.gerenciamento.estoque.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id // Marca este campo como a chave primária
    @Column(name = "produto_id", length = 36)
    private String id;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "preco", precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;

    @Column(name = "estoque")
    private int estoque;

    // Construtor padrão
    public Produto() {
    }

    // Construtor com todos os campos (opcional, mas útil)
    public Produto(String id, String nome, BigDecimal preco, int estoque) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getEstoque() {
        return estoque;
    }

    public void setEstoque(int estoque) {
        this.estoque = estoque;
    }
}