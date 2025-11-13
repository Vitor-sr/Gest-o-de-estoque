package com.gerenciamento.estoque.Models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "grupos_usuarios")
public class GrupoUsuario {

    @Id
    @Column(name = "grupo_id", length = 36)
    private String grupoId = UUID.randomUUID().toString();

    private String nome;

    // Getters e Setters
    public String getGrupoId() {
        return grupoId;
    }

    public void setGrupoId(String grupoId) {
        this.grupoId = grupoId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
