package com.gerenciamento.estoque.Models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "solicitacao_itens")
public class SolicitacaoItem {

    /**
     * @return the id
     */
    public UUID getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * @return the produto
     */
    public Produto getProduto() {
        return produto;
    }

    /**
     * @param produto the produto to set
     */
    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    /**
     * @return the quantidade
     */
    public Integer getQuantidade() {
        return quantidade;
    }

    /**
     * @param quantidade the quantidade to set
     */
    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    /**
     * @return the solicitacaoCompra
     */
    public SolicitacaoCompra getSolicitacaoCompra() {
        return solicitacaoCompra;
    }

    /**
     * @param solicitacaoCompra the solicitacaoCompra to set
     */
    public void setSolicitacaoCompra(SolicitacaoCompra solicitacaoCompra) {
        this.solicitacaoCompra = solicitacaoCompra;
    }

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    private Integer quantidade;

    @ManyToOne
    @JoinColumn(name = "solicitacao_id")
    private SolicitacaoCompra solicitacaoCompra;

    // getters e setters
}
