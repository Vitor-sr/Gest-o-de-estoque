package com.gerenciamento.estoque.services;

import com.gerenciamento.estoque.Models.SolicitacaoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SolicitacaoItemRepository extends JpaRepository<SolicitacaoItem, UUID> {
}

