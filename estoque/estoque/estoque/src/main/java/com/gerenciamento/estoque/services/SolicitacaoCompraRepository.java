package com.gerenciamento.estoque.services;

import com.gerenciamento.estoque.Models.SolicitacaoCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SolicitacaoCompraRepository extends JpaRepository<SolicitacaoCompra, UUID> {
    List<SolicitacaoCompra> findByFuncionarioUsuarioId(String funcionarioId);
}
