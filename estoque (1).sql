-- TABELAS
CREATE DATABASE estoque;
USE estoque;

CREATE TABLE grupos_usuarios (
    grupo_id CHAR(36) PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT uq_grupo_nome UNIQUE (nome)
);

CREATE TABLE usuarios (
    usuario_id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
    grupo_id CHAR(36),
    CONSTRAINT fk_usuario_grupo
        FOREIGN KEY (grupo_id) REFERENCES grupos_usuarios(grupo_id)
);

CREATE TABLE produtos (
    produto_id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    CONSTRAINT uq_produto_nome UNIQUE (nome)
);

CREATE TABLE movimentos (
    mov_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id CHAR(36),
    tipo ENUM('ENTRADA','SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    data_mov DATETIME DEFAULT NOW(),
    CONSTRAINT fk_mov_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(produto_id)
);

-- ÍNDICES
CREATE INDEX idx_produtos_nome ON produtos (nome);
CREATE INDEX idx_prod_categoria ON produtos (categoria);
CREATE INDEX idx_movimentos_prod ON movimentos (produto_id);

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
