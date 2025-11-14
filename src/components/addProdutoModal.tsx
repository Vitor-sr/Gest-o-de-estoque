import "./modalStyleGlobal.css";
import { useState } from "react";
import axios from "axios";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;

}

const AddProdutoModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");

    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        axios.post('http://localhost:5000/produtos', {
            nome,
            categoria,
            preco: preco ? Number(preco) : undefined,
        }).then(res => {
            console.log('produto adicionado com sucesso')
        }).catch(err => {
            console.error('erro ao adicionar', err)
        })
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Adicionar produto</h2>
                <form onSubmit={handleSave}>
                    <label>Nome: </label>
                    <input type="text" placeholder="Nome do produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <label>Preço: </label>
                    <input type="number" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                    <label>Categoria: </label>
                    <input type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProdutoModal;
