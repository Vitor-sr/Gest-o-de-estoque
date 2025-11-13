package com.gerenciamento.estoque.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "solicitacoes_compra")
public class SolicitacaoCompra {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Usuario funcionario; // quem fez a solicitação

    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDENTE;

    @OneToMany(mappedBy = "solicitacaoCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolicitacaoItem> itens;

    // Getters e setters

    public enum Status {
        PENDENTE, APROVADA, REJEITADA
    }

    // getters e setters

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
     * @return the funcionario
     */
    public Usuario getFuncionario() {
        return funcionario;
    }

    /**
     * @param funcionario the funcionario to set
     */
    public void setFuncionario(Usuario funcionario) {
        this.funcionario = funcionario;
    }

    /**
     * @return the dataCriacao
     */
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    /**
     * @param dataCriacao the dataCriacao to set
     */
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    /**
     * @return the status
     */
    public Status getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Status status) {
        this.status = status;
    }

    /**
     * @return the itens
     */
    public List<SolicitacaoItem> getItens() {
        return itens;
    }

    /**
     * @param itens the itens to set
     */
    public void setItens(List<SolicitacaoItem> itens) {
        this.itens = itens;
    }
}
