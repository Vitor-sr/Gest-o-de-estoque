import "./modalStyleGlobal.css";
import { useState } from "react";
import axios from "axios";

interface AjustarEstoqueModalProps {
    isOpen: boolean;
    onClose: () => void;
    produto: {
        produto_id: number;
        nome: string;
        quantidade: number;
    };
    onSave: (dados: { quantidade: number; operacao: "aumentar" | "reduzir" }) => void;
}

const AjustarEstoqueModal: React.FC<AjustarEstoqueModalProps> = ({
    isOpen,
    onClose,
    produto,
    onSave
}) => {
    const [quantidade, setQuantidade] = useState<number>(1);
    const [operacao, setOperacao] = useState<"aumentar" | "reduzir">("aumentar");

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (operacao === "reduzir") {
            await axios.put(`http://localhost:5000/diminuir_estoque`, {
                produto_id: produto.produto_id,
                quantidade: quantidade
            });
        } else {
            await axios.post("http://localhost:5000/requisicoes_estoque", {
                produto_id: produto.produto_id,
                quantidade_requisitada: quantidade
            });
        }
        onSave({ quantidade, operacao });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={e => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Ajustar estoque</h2>
                <form onSubmit={handleSave}>
                    <label>Produto: </label>
                    <input type="text" value={produto.nome} disabled style={{ background: "#f3f3f3" }} />
                    <label>Quantidade:</label>
                    <input
                        type="number"
                        min={1}
                        value={quantidade}
                        onChange={e => setQuantidade(Number(e.target.value))}
                        required
                    />
                    <label>Operação:</label>
                    <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                        <label>
                            <input
                                type="radio"
                                name="operacao"
                                value="aumentar"
                                checked={operacao === "aumentar"}
                                onChange={() => setOperacao("aumentar")}
                            />
                            Aumentar estoque (gera requisição)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="operacao"
                                value="reduzir"
                                checked={operacao === "reduzir"}
                                onChange={() => setOperacao("reduzir")}
                            />
                            Reduzir estoque (atualiza direto)
                        </label>
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button type="submit">Confirmar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjustarEstoqueModal;
