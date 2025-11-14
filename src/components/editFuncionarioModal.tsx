import "./modalStyleGlobal.css";
import { useState } from "react";
import axios from "axios";

interface EditFuncionarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    funcionario: {
        id_funcionario: number;
        grupo_id?: number;
        nome: string;
        idade?: number;
        cpf?: string;
        cargo?: string;
        senha?: string;
    };
    onSave: (dados: { nome: string; idade?: number; cpf?: string; cargo?: string; senha?: string }) => void;
}

const EditFuncionarioModal: React.FC<EditFuncionarioModalProps> = ({ isOpen, onClose, funcionario }) => {
    const [nome, setNome] = useState(funcionario.nome || "");
    const [idade, setIdade] = useState(funcionario.idade !== undefined ? String(funcionario.idade) : "");
    const [cpf, setCpf] = useState(funcionario.cpf || "");
    const [cargo, setCargo] = useState(funcionario.cargo || "");
    const [senha, setSenha] = useState(funcionario.senha || "");

    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        axios.put(`http://localhost:5000/funcionarios/${funcionario.id_funcionario}`, {
            nome,
            idade: idade ? Number(idade) : undefined,
            cpf,
            cargo,
            senha
        }).then((res) => {
            console.log('funcionou', res.data)
        }).catch((err) => {
            console.error('nao funcionou', err)
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={e => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Editar funcionário</h2>
                <form onSubmit={handleSave}>
                    <label>Nome: </label>
                    <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
                    <label>Idade: </label>
                    <input type="number" name="idade" placeholder="Idade" value={idade} onChange={e => setIdade(e.target.value)} required />
                    <label>CPF: </label>
                    <input type="text" name="cpf" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required />
                    <label>Cargo: </label>
                    <input type="text" name="cargo" placeholder="Cargo" value={cargo} onChange={e => setCargo(e.target.value)} required />
                    <label>Senha: </label>
                    <input type="text" name="senha" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFuncionarioModal;
