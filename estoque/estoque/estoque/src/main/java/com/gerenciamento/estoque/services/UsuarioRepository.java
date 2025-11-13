package com.gerenciamento.estoque.services;
import com.gerenciamento.estoque.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}
