import "./modalStyleGlobal.css";
import { useState } from "react";
import axios from "axios";

interface EditProdutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    produto: {
        produto_id: number;
        nome: string;
        preco: number;
        quantidade: number;
        categoria: string;
    };
    onSave: (dados: { nome: string; preco: number; quantidade: number; categoria: string }) => void;
}

const EditProdutoModal: React.FC<EditProdutoModalProps> = ({ isOpen, onClose, produto }) => {
    const [nome, setNome] = useState(produto.nome || "");
    const [categoria, setCategoria] = useState(produto.categoria || "");
    const [preco, setPreco] = useState(produto.preco !== undefined ? String(produto.preco) : "");

    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        axios.put(`http://localhost:5000/produtos/${produto.produto_id}`, {
            nome,
            preco: Number(preco),
            categoria
        }).then((res) => {
            console.log("sucesso", res);
        }).catch((err) => {
            console.log("erro", err)
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={e => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Editar produto</h2>
                <form onSubmit={handleSave}>
                    <label>Nome: </label>
                    <input type="text" placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} required />
                    <label>Preço: </label>
                    <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
                    <label>Categoria: </label>
                    <input type="text" placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required />
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProdutoModal;
