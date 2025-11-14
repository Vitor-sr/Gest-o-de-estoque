-- TABELAS
CREATE DATABASE estoque;
USE estoque;
DROP database estoque;

CREATE TABLE funcionarios(
	id_funcionario INT primary key auto_increment,
    nome varchar(50) not null,
    idade int not null,
    cpf varchar(11) unique not null,
    cargo varchar(50) unique not null,
    senha varchar(40) not null
);

insert into funcionarios(nome, idade, cpf, cargo, senha) value ("Carlos", "26", '11111111111', "Estoquista", '123');
insert into funcionarios(nome, idade, cpf, cargo, senha) value ("Pedro", "26", '11111122222', "Gerente", '123');
insert into funcionarios(nome, idade, cpf, cargo, senha) value ("Rafael", "30", '11111133333', "Comprador", '123');


drop table funcionarios;
drop table produtos;
select * from produtos;
select * from inserir_estoque;
select * from funcionarios;
select * from requisicoes_estoque;

CREATE TABLE produtos (
    produto_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    CONSTRAINT uq_produto_nome UNIQUE (nome)
) ENGINE=InnoDB;


CREATE TABLE inserir_estoque (
    estoque_id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE requisicoes_estoque (
    id_requisicao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    quantidade_requisitada INT NOT NULL,
    data_requisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    FOREIGN KEY (id_produto) REFERENCES produtos(produto_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


CREATE TABLE requisicoes_concluidas (
    id_conclusao INT AUTO_INCREMENT PRIMARY KEY,
    id_requisicao INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade_requisitada INT NOT NULL,
    data_conclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    concluida BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_produto) REFERENCES produtos(produto_id),
    FOREIGN KEY (id_requisicao) REFERENCES requisicoes_estoque(id_requisicao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ÍNDICES
CREATE INDEX idx_produtos_nome ON produtos (nome);
CREATE INDEX idx_prod_categoria ON produtos (categoria);
CREATE INDEX idx_movimentos_prod ON movimentos (produto_id);

START TRANSACTION;

INSERT INTO requisicoes_concluidas (id_requisicao, id_produto, quantidade_requisitada)
SELECT id_requisicao, id_produto, quantidade_requisitada
FROM requisicoes_estoque
WHERE id_requisicao = X;

UPDATE inserir_estoque 
SET quantidade = quantidade + (
    SELECT quantidade_requisitada 
    FROM requisicoes_estoque 
    WHERE id_requisicao = X
)
WHERE produto_id = (
    SELECT id_produto FROM requisicoes_estoque WHERE id_requisicao = X
);

UPDATE requisicoes_estoque
SET status = 'CONCLUIDA'
WHERE id_requisicao = X;

COMMIT;

-- FUNÇÃO GERAR ID
DELIMITER $$
CREATE FUNCTION gerar_id()
RETURNS CHAR(36)
DETERMINISTIC
RETURN UUID();
$$
DELIMITER ;

-- TRIGGERS
DELIMITER $$
CREATE TRIGGER trg_bloqueia_estoque
BEFORE INSERT ON movimentos
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'SAIDA' THEN
        IF (SELECT estoque FROM produtos WHERE produto_id = NEW.produto_id) < NEW.quantidade THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Estoque insuficiente';
        END IF;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_atualiza_estoque
AFTER INSERT ON movimentos
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'ENTRADA' THEN
        UPDATE produtos
        SET estoque = estoque + NEW.quantidade
        WHERE produto_id = NEW.produto_id;
    ELSE
        UPDATE produtos
        SET estoque = estoque - NEW.quantidade
        WHERE produto_id = NEW.produto_id;
    END IF;
END $$
DELIMITER ;

-- VIEWS
CREATE VIEW view_produtos_estoque AS
SELECT produto_id, nome, estoque, categoria
FROM produtos;

CREATE VIEW view_movimentos_detalhes AS
SELECT m.mov_id, p.nome AS produto, p.categoria, m.tipo, m.quantidade, m.data_mov
FROM movimentos m
JOIN produtos p ON p.produto_id = m.produto_id;

CREATE VIEW vw_produtos_estoque AS
SELECT * FROM produtos;

CREATE VIEW vw_movimentos_detalhes AS
SELECT m.mov_id, p.nome, p.categoria, m.tipo, m.quantidade, m.data_mov
FROM movimentos m
INNER JOIN produtos p ON p.produto_id = m.produto_id;

-- FUNÇÃO CONSULTAR ESTOQUE
DELIMITER $$
CREATE FUNCTION consultar_estoque(pid CHAR(36))
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN (SELECT estoque FROM produtos WHERE produto_id = pid);
END $$
DELIMITER ;

-- PROCEDURE
DELIMITER $$
CREATE PROCEDURE cadastrar_produto(
    IN nome_p VARCHAR(100),
    IN preco_p DECIMAL(10,2),
    IN categoria_p VARCHAR(100)
)
BEGIN
    INSERT INTO produtos (produto_id, nome, preco, categoria)
    VALUES (gerar_id(), nome_p, preco_p, categoria_p);
END $$
DELIMITER ;

-- USUÁRIOS E PERMISSÕES
USE estoque;

CREATE USER 'Operador'@'localhost' IDENTIFIED BY '12345';
GRANT SELECT ON estoque.vw_produtos_estoque TO 'Operador'@'localhost';
GRANT SELECT ON estoque.vw_movimentos_detalhes TO 'Operador'@'localhost';
GRANT SELECT, INSERT ON estoque.movimentos TO 'Operador'@'localhost';

CREATE USER 'Gerente'@'localhost' IDENTIFIED BY '12345';
GRANT SELECT, UPDATE, INSERT ON estoque.* TO 'Gerente'@'localhost';

CREATE USER 'AdminEstoque'@'localhost' IDENTIFIED BY '12345';
GRANT SELECT, UPDATE, INSERT, DELETE ON estoque.* TO 'AdminEstoque'@'localhost';

FLUSH PRIVILEGES;

SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT apagar_requisicoes_expiradas
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    DELETE FROM requisicoes_concluidas
    WHERE TIMESTAMPDIFF(MINUTE, data_conclusao, NOW()) > 10;
    
    DELETE FROM requisicoes_estoque
    WHERE TIMESTAMPDIFF(MINUTE, data_requisicao, NOW()) > 10
      AND status = 'PENDENTE';
END $$
