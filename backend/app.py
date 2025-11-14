from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import random

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "estoque"
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def gerar_token():
    return str(random.randint(100000, 999999))

# ----------- PRODUTOS -----------
@app.route("/produtos", methods=["GET"])
def listar_produtos():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT produto_id, nome, preco, categoria FROM produtos")
    rows = c.fetchall()
    c.close()
    conn.close()
    produtos = [
        {"produto_id": row[0], "nome": row[1], "preco": float(row[2]), "categoria": row[3]}
        for row in rows
    ]
    return jsonify(produtos)

@app.route("/produtos", methods=["POST"])
def criar_produto():
    data = request.json
    nome = data.get("nome")
    preco = data.get("preco")
    categoria = data.get("categoria")
    print(data);

    if not nome or preco is None or not categoria:
        return jsonify({"error": "Campos obrigatórios: nome, preco, categoria"}), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO produtos (nome, preco, categoria) VALUES (%s, %s, %s)", (nome, preco, categoria))
    conn.commit()
    produto_id = c.lastrowid
    c.close()
    conn.close()
    return jsonify({"produto_id": produto_id, "nome": nome, "preco": preco, "categoria": categoria}), 201

@app.route("/produtos/<int:produto_id>", methods=["PUT"])
def editar_produto(produto_id):
    data = request.json
    nome = data.get("nome")
    preco = data.get("preco")
    categoria = data.get("categoria")
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT nome, preco, categoria FROM produtos WHERE produto_id=%s", (produto_id,))
    atual = c.fetchone()
    if not atual:
        c.close()
        conn.close()
        return jsonify({"error": "Produto não encontrado"}), 404
    nome = nome if nome is not None else atual[0]
    preco = preco if preco is not None else atual[1]
    categoria = categoria if categoria is not None else atual[2]
    c.execute("UPDATE produtos SET nome=%s, preco=%s, categoria=%s WHERE produto_id=%s", (nome, preco, categoria, produto_id))
    conn.commit()
    c.close()
    conn.close()
    return jsonify({"produto_id": produto_id, "nome": nome, "preco": preco, "categoria": categoria})

@app.route("/produtos/<int:produto_id>", methods=["DELETE"])
def deletar_produto(produto_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM produtos WHERE produto_id=%s", (produto_id,))
    conn.commit()
    c.close()
    conn.close()
    return jsonify({"result": "ok"})

@app.route("/produtos_com_estoque", methods=["GET"])
def listar_produtos_com_estoque():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        SELECT p.produto_id, p.nome, p.categoria, p.preco, ie.quantidade
        FROM produtos p
        LEFT JOIN inserir_estoque ie ON p.produto_id = ie.produto_id
    """)
    rows = c.fetchall()
    c.close()
    conn.close()
    produtos = [
        {
            "produto_id": row[0],
            "nome": row[1],
            "categoria": row[2],
            "preco": float(row[3]),
            "quantidade": row[4] if row[4] is not None else 0
        }
        for row in rows
    ]
    return jsonify(produtos)

@app.route("/diminuir_estoque", methods=["PUT"])
def diminuir_estoque():
    data = request.json
    produto_id = data.get("produto_id")
    quantidade = data.get("quantidade")

    if produto_id is None or quantidade is None:
        return jsonify({"error": "Campos obrigatórios: produto_id, quantidade"}), 400
    try:
        produto_id = int(produto_id)
        quantidade = int(quantidade)
        if quantidade <= 0:
            return jsonify({"error": "A quantidade deve ser maior que zero"}), 400
    except ValueError:
        return jsonify({"error": "produto_id e quantidade devem ser números inteiros"}), 400

    conn = get_db_connection()
    c = conn.cursor(dictionary=True)

    try:
        c.execute("SELECT quantidade FROM inserir_estoque WHERE produto_id = %s", (produto_id,))
        estoque = c.fetchone()

        if not estoque:
            return jsonify({"error": "Estoque não encontrado para este produto"}), 404

        print(estoque)
        if estoque["quantidade"] < quantidade:
            return jsonify({"error": "Estoque insuficiente"}), 400

        c.execute("""
            UPDATE inserir_estoque
            SET quantidade = quantidade - %s
            WHERE produto_id = %s
        """, (quantidade, produto_id))

        conn.commit()
        return jsonify({"result": "ok"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        c.close()
        conn.close()
    return jsonify({"result": "ok"})

# ----------- FUNCIONARIOS -----------
@app.route("/funcionarios", methods=["GET"])
def listar_funcionarios():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id_funcionario, nome, idade, cpf, cargo FROM funcionarios")
    rows = c.fetchall()
    c.close()
    conn.close()
    funcionarios = [
        {"id_funcionario": row[0], "nome": row[1], "idade": row[2], "cpf": row[3], "cargo": row[4]}
        for row in rows
    ]
    return jsonify(funcionarios)

@app.route("/funcionarios", methods=["POST"])
def criar_funcionario():
    data = request.json
    nome = data.get("nome")
    idade = data.get("idade")
    cpf = data.get("cpf")
    cargo = data.get("cargo")
    senha = data.get("senha")
    if not nome or not cpf or not cargo or not senha:
        return jsonify({"error": "Campos obrigatórios: nome, cpf, cargo, senha"}), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO funcionarios ( nome, idade ,cpf, cargo, senha) VALUES (%s, %s, %s, %s, %s)", (nome, idade, cpf, cargo, senha))
    conn.commit()
    id_funcionario = c.lastrowid
    c.close()
    conn.close()
    return jsonify({"id_funcionario": id_funcionario, "nome": nome, "cpf": cpf, "cargo": cargo}), 201

@app.route("/funcionarios/<int:id_funcionario>", methods=["PUT"])
def editar_funcionario(id_funcionario):
    data = request.json
    nome = data.get("nome")
    idade = data.get("idade")
    cpf = data.get("cpf")
    cargo = data.get("cargo")
    senha = data.get("senha")
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE funcionarios SET nome=%s, idade=%s, cpf=%s, cargo=%s, senha=%s WHERE id_funcionario=%s", (nome, idade, cpf, cargo, senha, id_funcionario))
    conn.commit()
    c.close()
    conn.close()
    return jsonify({"id_funcionario": id_funcionario, "nome": nome, "idade": idade, "cpf": cpf, "cargo": cargo, "senha": senha})

@app.route("/funcionarios/<int:id_funcionario>", methods=["DELETE"])
def deletar_funcionario(id_funcionario):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM funcionarios WHERE id_funcionario=%s", (id_funcionario,))
    conn.commit()
    c.close()
    conn.close()
    return jsonify({"result": "ok"})


# ----------- REQUISICOES ESTOQUE -----------
@app.route("/requisicoes_estoque", methods=["GET"])
def listar_requisicoes():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id_requisicao, id_produto, quantidade_requisitada, data_requisicao, status FROM requisicoes_estoque")
    rows = c.fetchall()
    c.close()
    conn.close()
    requisicoes = [
        {"id_requisicao": row[0], "id_produto": row[1], "quantidade_requisitada": row[2], "data_requisicao": row[3], "status": row[4]}
        for row in rows
    ]
    return jsonify(requisicoes)

@app.route("/requisicoes_estoque", methods=["POST"])
def criar_requisicao():
    data = request.json
    id_produto = data.get("id_produto")
    quantidade_requisitada = data.get("quantidade_requisitada")
    if not id_produto or not quantidade_requisitada:
        return jsonify({"error": "Campos obrigatórios: id_produto, quantidade_requisitada"}), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO requisicoes_estoque (id_produto, quantidade_requisitada) VALUES (%s, %s)", (id_produto, quantidade_requisitada))
    conn.commit()
    id_requisicao = c.lastrowid
    c.close()
    conn.close()
    return jsonify({"id_requisicao": id_requisicao, "id_produto": id_produto, "quantidade_requisitada": quantidade_requisitada}), 201

# ----------- REQUISICOES CONCLUIDAS -----------
@app.route("/requisicoes_concluidas_ls", methods=["GET"])
def listar_requisicoes_concluidas():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id_conclusao, id_requisicao, id_produto, quantidade_requisitada, data_conclusao, concluida FROM requisicoes_concluidas")
    rows = c.fetchall()
    c.close()
    conn.close()
    concluidas = [
        {"id_conclusao": row[0], "id_requisicao": row[1], "id_produto": row[2], "quantidade_requisitada": row[3], "data_conclusao": row[4], "concluida": bool(row[5])}
        for row in rows
    ]
    return jsonify(concluidas)

@app.route("/requisicoes_concluidas", methods=["POST"])
def concluir_requisicao():
    data = request.json
    id_requisicao = data.get("id_requisicao")
    id_produto = data.get("id_produto")
    quantidade_requisitada = data.get("quantidade_requisitada")

    if id_requisicao is None or id_produto is None or quantidade_requisitada is None:
        return jsonify({"error": "Campos obrigatórios: id_requisicao, id_produto, quantidade_requisitada"}), 400

    try:
        id_requisicao = int(id_requisicao)
        id_produto = int(id_produto)
        quantidade_requisitada = int(quantidade_requisitada)
    except (ValueError, TypeError):
        return jsonify({"error": "id_requisicao, id_produto e quantidade_requisitada devem ser numéricos"}), 400

    if quantidade_requisitada <= 0:
        return jsonify({"error": "quantidade_requisitada deve ser maior que zero"}), 400

    conn = get_db_connection()
    c = conn.cursor(dictionary=True)

    try:
        c.execute("SELECT * FROM requisicoes_estoque WHERE id_requisicao = %s", (id_requisicao,))
        req = c.fetchone()
        if not req:
            return jsonify({"error": "Requisição não encontrada"}), 404
        if req.get("status") != "PENDENTE":
            return jsonify({"error": "Requisição já concluída"}), 400

        c.execute("SELECT produto_id FROM produtos WHERE produto_id = %s", (id_produto,))
        prod = c.fetchone()
        if not prod:
            return jsonify({"error": "Produto não encontrado"}), 404

        c.execute(
            "INSERT INTO inserir_estoque (produto_id, quantidade) VALUES (%s, %s) "
            "ON DUPLICATE KEY UPDATE quantidade = quantidade + %s",
            (id_produto, quantidade_requisitada, quantidade_requisitada)
        )

        c.execute(
            "INSERT INTO requisicoes_concluidas (id_requisicao, id_produto, quantidade_requisitada) VALUES (%s, %s, %s)",
            (id_requisicao, id_produto, quantidade_requisitada)
        )

        c.execute(
            "UPDATE requisicoes_estoque SET status = 'CONCLUIDA' WHERE id_requisicao = %s",
            (id_requisicao,)
        )

        c.execute("SELECT quantidade FROM inserir_estoque WHERE produto_id = %s", (id_produto,))
        estoque_row = c.fetchone()
        quantidade_estoque = estoque_row["quantidade"] if estoque_row else None

        conn.commit()
        return jsonify({
            "result": "ok",
            "id_requisicao": id_requisicao,
            "id_produto": id_produto,
            "quantidade_requisitada": quantidade_requisitada,
            "quantidade_estoque": quantidade_estoque
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        c.close()
        conn.close()
@app.route("/login", methods=["POST"])
def login_funcionario():
    data = request.json
    cpf = data.get("cpf")
    senha = data.get("senha")
    if not cpf and not senha:
        return jsonify({"error": "CPF e senha são obrigatórios"}), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id_funcionario, cargo FROM funcionarios WHERE cpf=%s AND senha=%s", (cpf, senha))
    row = c.fetchone()
    c.close()
    conn.close()
    if row:
        token = gerar_token()
        cargo = row[1]
        return jsonify({"token": token, "cargo": cargo}), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401

if __name__ == "__main__":
    app.run(debug=True)
