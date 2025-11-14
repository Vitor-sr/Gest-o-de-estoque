import "./modalStyleGlobal.css";

interface InfoFuncionarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    funcionario: {
        id_funcionario: number;
        nome: string;
        idade?: number;
        cpf?: string;
        cargo?: string;
    };
}

const InfoFuncionarioModal: React.FC<InfoFuncionarioModalProps> = ({
    isOpen,
    onClose,
    funcionario
}) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={e => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Informações do funcionário</h2>
                <div style={{marginBottom: 16}}>
                    <p><strong>Nome:</strong> {funcionario.nome}</p>
                    {funcionario.idade !== undefined && <p><strong>Idade:</strong> {funcionario.idade}</p>}
                    {funcionario.cpf && <p><strong>CPF:</strong> {funcionario.cpf}</p>}
                    {funcionario.cargo && <p><strong>Cargo:</strong> {funcionario.cargo}</p>}
                    <p><strong>ID:</strong> {funcionario.id_funcionario}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default InfoFuncionarioModal;
