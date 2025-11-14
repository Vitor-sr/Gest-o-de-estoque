import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
    const nav = useNavigate();
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post("http://localhost:5000/login", {
                cpf,
                senha
            });
            const { token, cargo } = res.data;
            localStorage.setItem("auth_token", token);
            localStorage.setItem("cargo", cargo);
            if (cargo === "Gerente") {
                nav('/dashboard');
            } else if (cargo === "Comprador") {
                nav('/dashboardCom');
            } else if (cargo === "Estoquista") {
                nav('/dashboardFun');
            } else {
                setError("Cargo inválido.");
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || "Erro ao fazer login");
        }
    };

    return (
        <div>
            <section>
                <div className="loginContainer">
                    <form className="loginContainerForm" onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        {error && <p className="setError">{error}</p>}
                        <label htmlFor="cpf">CPF:</label>
                        <input
                            type="text"
                            placeholder="CPF"
                            className="userValue"
                            required
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            className="passValue"
                            placeholder="Senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <button type="submit" className="loginButton">Entrar</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;