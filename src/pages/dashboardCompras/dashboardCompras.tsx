import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboardCompras.css";

// Tipos
type Requisicao = {
    id_requisicao: number;
    id_produto: number;
    quantidade_requisitada: number;
    data_requisicao: string;
    status: string;
    nome_produto?: string;
};

type RequisicaoConcluida = {
    id_conclusao: number;
    id_requisicao: number;
    id_produto: number;
    quantidade_requisitada: number;
    data_conclusao: string;
    concluida: boolean;
    nome_produto?: string;
};

type Produto = {
    produto_id: number;
    nome: string;
};

const DashboardCompras: React.FC = () => {
    const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
    const [concluidas, setConcluidas] = useState<RequisicaoConcluida[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [modalAbrirIdx, setModalAbrirIdx] = useState<number | null>(null);
    const [modalFazerIdx, setModalFazerIdx] = useState<number | null>(null);

    
    useEffect(() => {
        axios.get("http://localhost:5000/produtos").then(res => setProdutos(res.data));
        axios.get("http://localhost:5000/requisicoes_estoque").then(res => setRequisicoes(res.data));
        axios.get("http://localhost:5000/requisicoes_concluidas").then(res => setConcluidas(res.data));
    }, []);

    
    function getNomeProduto(id_produto: number) {
        const prod = produtos.find(p => p.produto_id === id_produto);
        return prod ? prod.nome : "Produto";
    }

    
    function ModalAbrirPedido({ req, onClose }: { req: Requisicao, onClose: () => void }) {
        return (
            <div className="modalOverlay" onClick={onClose}>
                <div className="modalContainer" onClick={e => e.stopPropagation()}>
                    <span className="closeModal" onClick={onClose}>X</span>
                    <h2>Informações do Pedido</h2>
                    <p><strong>Produto:</strong> {getNomeProduto(req.id_produto)}</p>
                    <p><strong>Quantidade requisitada:</strong> {req.quantidade_requisitada}</p>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button type="button" onClick={onClose}>Fechar</button>
                    </div>
                </div>
            </div>
        );
    }

    
    function ModalFazerPedido({ req, onClose }: { req: Requisicao, onClose: () => void }) {
        const [qtd, setQtd] = useState<number>(req.quantidade_requisitada);

        const handleFazer = async (e?: React.FormEvent) => {
            e?.preventDefault();
           
            await axios.post("http://localhost:5000/requisicoes_concluidas", {
                id_requisicao: req.id_requisicao,
                id_produto: req.id_produto,
                quantidade_requisitada: qtd
            });
            
            onClose();
            
            axios.get("http://localhost:5000/requisicoes_estoque").then(res => setRequisicoes(res.data));
            axios.get("http://localhost:5000/requisicoes_concluidas_ls").then(res => setConcluidas(res.data));
        };

        return (
            <div className="modalOverlay" onClick={onClose}>
                <div className="modalContainer" onClick={e => e.stopPropagation()}>
                    <span className="closeModal" onClick={onClose}>X</span>
                    <h2>Fazer Pedido</h2>
                    <form onSubmit={handleFazer}>
                        <label>Produto:</label>
                        <input type="text" value={getNomeProduto(req.id_produto)} disabled style={{ background: "#f3f3f3" }} />
                        <label>Quantidade:</label>
                        <input type="number" min={1} value={qtd} onChange={e => setQtd(Number(e.target.value))} required />
                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                            <button type="submit">Fazer</button>
                            <button type="button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dc-bg">
            <h2 className="dc-title">Gestao de pedidos</h2>
            <div className="dc-section">
                <div className="dc-label">Pedidos:</div>
                <div className="dc-list dc-list-abertos">
                    {requisicoes.map((req, idx) => (
                        <div className="dc-row" key={req.id_requisicao}>
                            <div className="dc-cell dc-cell-nome">{getNomeProduto(req.id_produto)}</div>
                            <div className="dc-cell dc-cell-btn">
                                <button className="dc-btn" onClick={() => setModalAbrirIdx(idx)}>Abrir pedido</button>
                            </div>
                            <div className="dc-cell dc-cell-btn">
                                <button className="dc-btn" onClick={() => setModalFazerIdx(idx)}>Fazer pedido</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dc-section">
                <div className="dc-label">Concluidos:</div>
                <div className="dc-list dc-list-concluidos">
                    {concluidas.map((req, idx) => (
                        <div className="dc-row" key={req.id_conclusao}>
                            <div className="dc-cell dc-cell-nome">{getNomeProduto(req.id_produto)}</div>
                            <div className="dc-cell dc-cell-id">Id = {req.id_requisicao}</div>
                        </div>
                    ))}
                </div>
            </div>
            {modalAbrirIdx !== null && requisicoes[modalAbrirIdx] && (
                <ModalAbrirPedido req={requisicoes[modalAbrirIdx]} onClose={() => setModalAbrirIdx(null)} />
            )}
            {modalFazerIdx !== null && requisicoes[modalFazerIdx] && (
                <ModalFazerPedido req={requisicoes[modalFazerIdx]} onClose={() => setModalFazerIdx(null)} />
            )}
        </div>
    );
};

export default DashboardCompras;
