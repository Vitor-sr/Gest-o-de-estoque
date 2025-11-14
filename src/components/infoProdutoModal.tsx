import "./modalStyleGlobal.css";

interface InfoProdutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    produto: {
        produto_id: number;
        nome: string;
        preco: number;
        quantidade: number;
        categoria: string;
    };
}

const InfoProdutoModal: React.FC<InfoProdutoModalProps> = ({
    isOpen,
    onClose,
    produto
}) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={e => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Informações do produto</h2>
                <div style={{marginBottom: 16}}>
                    <p><strong>Nome:</strong> {produto.nome}</p>
                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                    <p><strong>Preço:</strong> R$ {produto.preco}</p>
                    <p><strong>Estoque:</strong> {produto.quantidade}</p>
                    <p><strong>ID:</strong> {produto.produto_id}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default InfoProdutoModal;
