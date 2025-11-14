import "./modalStyleGlobal.css";
import { useState } from "react";
import axios from "axios";

interface ModalProps {
    isOpen: boolean
    onClose: () => void;
}


const AddFuncionarioModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [cpf, setCpf] = useState("");
    const [cargo, setCargo] = useState("");
    const [senha, setSenha] = useState("");
    
 

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        axios.post('http://localhost:5000/funcionarios', {
            nome,
            idade,
            cpf,
            cargo,
            senha
        }).then((res) => {
            console.log('funcionario adicionado com sucesso', res)
        }).catch((err) => {
            console.error('erro ao adicionar funcionario', err)
        });
        onClose();
    }


    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
                <span className="closeModal" onClick={onClose}>X</span>
                <h2>Adicionar funcionário</h2>
                <form onSubmit={handleSave}>
                    <label>Nome: </label>
                    <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required/>
                    <label>Idade: </label>
                    <input type="number" name="idade" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} required/>
                    <label>CPF: </label>
                    <input type="text" name="cpf" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required/>
                    <label>Cargo: </label>
                    <input type="text" name="cargo" placeholder="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} required/>
                    <label>Senha</label>
                    <input type="text" name="senha" placeholder="Crie uma senha pro funcionario" value={senha} onChange={(e) => setSenha(e.target.value)} required/>
                    <div style={{marginTop:12, display:'flex', gap:8}}>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddFuncionarioModal;

