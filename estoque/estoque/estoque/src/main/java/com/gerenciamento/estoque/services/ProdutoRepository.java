
package com.gerenciamento.estoque.services;

import com.gerenciamento.estoque.Models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, String>{
    
}
