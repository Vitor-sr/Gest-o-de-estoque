import React, { useState, useEffect } from "react";
import "./dashboardFuncionario.css";
import configIcon from "../../assets/icons/config.svg";
import EditProdutoModal from "../../components/editProdutoModal";
import AjustarEstoqueModal from "../../components/ajustarEstoqueModal";
import axios from "axios";

type Produto = {
    produto_id: number;
    nome: string;
    preco: number;
    quantidade: number;
    categoria: string;
};

const DashboardFuncionario: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [ajustarIdx, setAjustarIdx] = useState<number | null>(null);

    useEffect(() => {
        axios.get('http://localhost:5000/produtos_com_estoque')
            .then(res => setProdutos(res.data))
            .catch(() => setProdutos([]));
    }, []);

    function handleCloseEditProdutoModal() {
        setEditIdx(null);
        axios.get('http://localhost:5000/produtos')
            .then(res => setProdutos(res.data))
            .catch(() => setProdutos([]));
    }

    return (
        <div className="df-container">
            <h1 className="df-title">Lista de produtos</h1>
            <div className="df-table">
                {produtos.map((produto, idx) => (
                    <div className="df-row" key={produto.produto_id || idx}>
                        <div className="df-cell df-produto">{produto.nome}</div>
                        <div className="df-cell df-quantidade">Quantidade: {produto.quantidade}</div>
                        <div className="df-cell df-actions">
                            <button
                                className="df-config-btn"
                                title="Configurações"
                                onClick={() => setEditIdx(idx)}
                            >
                                <img src={configIcon} alt="Configuração" className="df-config-icon" />
                            </button>
                            <button
                                className="df-buy-btn"
                                title="Editar estoque"
                                onClick={() => setAjustarIdx(idx)}
                            >
                                Editar estoque
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {editIdx !== null && (
                <EditProdutoModal
                    isOpen={true}
                    onClose={handleCloseEditProdutoModal}
                    produto={produtos[editIdx]}
                    onSave={() => {}}
                />
            )}
            {ajustarIdx !== null && (
                <AjustarEstoqueModal
                    isOpen={true}
                    onClose={() => setAjustarIdx(null)}
                    produto={produtos[ajustarIdx]}
                    onSave={() => setAjustarIdx(null)}
                />
            )}
        </div>
    );
};

export default DashboardFuncionario;