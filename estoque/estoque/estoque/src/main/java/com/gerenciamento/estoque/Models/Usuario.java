package com.gerenciamento.estoque.Models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(name = "usuario_id", length = 36)
    private String usuarioId = UUID.randomUUID().toString();

    private String nome;
    private String email;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private GrupoUsuario grupo;

    // Getters e Setters
    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public GrupoUsuario getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupoUsuario grupo) {
        this.grupo = grupo;
    }
}
