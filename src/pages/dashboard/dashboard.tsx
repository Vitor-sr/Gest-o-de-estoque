import React, { useState, useRef, useEffect } from "react";
import AddFuncionarioModal from '../../components/addFuncionarioModal'
import AddProdutoModal from '../../components/addProdutoModal'
import EditProdutoFuncionarioModal from '../../components/editProdutoFuncionarioModal'
import EditFuncionarioModal from '../../components/editFuncionarioModal'
import InfoProdutoModal from '../../components/infoProdutoModal'
import InfoFuncionarioModal from '../../components/infoFuncionarioModal'
import "./dashboard.css";
import editar from '../../assets/icons/editar.svg'
import lixeira from '../../assets/icons/lixeira.svg'
import info from '../../assets/icons/info.svg';
import axios from "axios";

const iconMap = {
    edit: editar,
    info: info,
    delete: lixeira
};

const Dashboard: React.FC = () => {
    const [view, setView] = useState<'produtos' | 'funcionarios'>('produtos');
    const [produtos, setProdutos] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const addButtonRef = useRef<HTMLButtonElement | null>(null);
    const [modalType, setModalType] = useState<null | 'funcionario' | 'produto'>(null);
    const [editProdutoIdx, setEditProdutoIdx] = useState<number | null>(null);
    const [editFuncionarioIdx, setEditFuncionarioIdx] = useState<number | null>(null);
    const [infoProdutoIdx, setInfoProdutoIdx] = useState<number | null>(null);
    const [infoFuncionarioIdx, setInfoFuncionarioIdx] = useState<number | null>(null);

    
    const fetchProdutos = async () => {
        try {
            const res = await axios.get("http://localhost:5000/produtos_com_estoque");
            setProdutos(res.data);
        } catch (err) {
            setProdutos([]);
        }
    };

    const fetchFuncionarios = async () => {
        try {
            const res = await axios.get("http://localhost:5000/funcionarios");
            setFuncionarios(res.data);
        } catch (err) {
            setFuncionarios([]);
        }
    };

    useEffect(() => {
        fetchProdutos();
        fetchFuncionarios();
    }, []);

    function handleCloseProdutoModal() {
        setModalType(null);
        fetchProdutos();
    }
    function handleCloseFuncionarioModal() {
        setModalType(null);
        fetchFuncionarios();
    }
    function handleCloseEditProdutoModal() {
        setEditProdutoIdx(null);
        fetchProdutos();
    }
    function handleCloseEditFuncionarioModal() {
        setEditFuncionarioIdx(null);
        fetchFuncionarios();
    }

    function handleMenuClick(nextView: 'produtos' | 'funcionarios') {
        setView(nextView);
    }

    function handleAddClick() {
        if (addButtonRef.current && addButtonRef.current.animate) {
            addButtonRef.current.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }],
                { duration: 180 }
            );
        }
        if (view === 'produtos') setModalType('produto');
        if (view === 'funcionarios') setModalType('funcionario');
    }

    function handleEditProduto(idx: number) {
        setEditProdutoIdx(idx);
    }
    function handleEditFuncionario(idx: number) {
        setEditFuncionarioIdx(idx);
    }

    // Deletar produto via axios
    async function handleDeleteProduto(idx: number) {
        const produto = produtos[idx];
        if (!produto?.produto_id) return;
        try {
            await axios.delete(`http://localhost:5000/produtos/${produto.produto_id}`);
            fetchProdutos();
        } catch (err) {
            alert("Erro ao deletar produto");
        }
    }

    const items = view === 'produtos' ? produtos : funcionarios;
    const mainTitle = view === 'produtos' ? 'Produtos' : 'Funcionários';
    const cardTitle = view === 'produtos' ? 'Lista de Produtos' : 'Lista de Funcionários';
    const addLabel = view === 'produtos' ? 'Adicionar produto' : 'Adicionar funcionário';

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">Gerenciamento</div>
                <nav className="menu">
                    <button
                        className={`menu-btn ${view === 'produtos' ? 'active' : ''}`}
                        data-view="produtos"
                        onClick={() => handleMenuClick('produtos')}
                    >
                        Produtos
                    </button>
                    <button
                        className={`menu-btn ${view === 'funcionarios' ? 'active' : ''}`}
                        data-view="funcionarios"
                        onClick={() => handleMenuClick('funcionarios')}
                    >
                        Funcionários
                    </button>
                </nav>
            </aside>

            <main className="main">
                <header className="main-header">
                    <h1 id="mainTitle">{mainTitle}</h1>
                </header>

                <section className="content">
                    {modalType === 'funcionario' && (
                        <AddFuncionarioModal
                            isOpen={true}
                            onClose={handleCloseFuncionarioModal}
                        />
                    )}

                    {modalType === 'produto' && (
                        <AddProdutoModal
                            isOpen={true}
                            onClose={handleCloseProdutoModal}
                        />
                    )}

                    {editProdutoIdx !== null && view === 'produtos' && (
                        <EditProdutoFuncionarioModal
                            isOpen={true}
                            onClose={handleCloseEditProdutoModal}
                            produto={{
                                nome: produtos[editProdutoIdx].nome,
                                categoria: produtos[editProdutoIdx].categoria,
                                preco: produtos[editProdutoIdx].preco,
                                id: produtos[editProdutoIdx].produto_id
                            }}
                            onSave={() => {}}
                        />
                    )}

                    {editFuncionarioIdx !== null && view === 'funcionarios' && (
                        <EditFuncionarioModal
                            isOpen={true}
                            onClose={handleCloseEditFuncionarioModal}
                            funcionario={funcionarios[editFuncionarioIdx]}
                            onSave={() => {}}
                        />
                    )}

                    {infoProdutoIdx !== null && view === 'produtos' && (
                        <InfoProdutoModal
                            isOpen={true}
                            onClose={() => setInfoProdutoIdx(null)}
                            produto={produtos[infoProdutoIdx]}
                        />
                    )}

                    {infoFuncionarioIdx !== null && view === 'funcionarios' && (
                        <InfoFuncionarioModal
                            isOpen={true}
                            onClose={() => setInfoFuncionarioIdx(null)}
                            funcionario={funcionarios[infoFuncionarioIdx]}
                        />
                    )}

                    <div className="card">
                        <div className="card-header">
                            <h2 id="cardTitle">{cardTitle}</h2>
                            <button
                                id="addButton"
                                className="add-btn"
                                ref={addButtonRef}
                                onClick={handleAddClick}
                            >
                                {addLabel}
                            </button>
                        </div>

                        <div className="list" id="listContainer" role="list">
                            {items.map((item, idx) => (
                                <div className="list-item" role="listitem" data-index={idx} key={item.produto_id || item.id_funcionario || idx}>
                                    <div className="item-name">
                                        {item.nome}
                                    </div>
                                    <div className="item-actions">
                                        {view === "produtos" && (
                                            <>
                                                <button
                                                    className="action-btn edit"
                                                    title="Editar"
                                                    aria-label="Editar"
                                                    onClick={() => handleEditProduto(idx)}
                                                >
                                                    <img className="icon" src={iconMap.edit} alt="editar" />
                                                </button>
                                                <button
                                                    className="action-btn info"
                                                    title="Informações"
                                                    aria-label="Informações"
                                                    onClick={() => setInfoProdutoIdx(idx)}
                                                >
                                                    <img className="icon" src={iconMap.info} alt="info" />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    title="Excluir"
                                                    aria-label="Excluir"
                                                    onClick={() => handleDeleteProduto(idx)}
                                                >
                                                    <img className="icon" src={iconMap.delete} alt="excluir" />
                                                </button>
                                            </>
                                        )}
                                        {view === "funcionarios" && (
                                            <>
                                                <button
                                                    className="action-btn edit"
                                                    title="Editar"
                                                    aria-label="Editar"
                                                    onClick={() => handleEditFuncionario(idx)}
                                                >
                                                    <img className="icon" src={iconMap.edit} alt="editar" />
                                                </button>
                                                <button
                                                    className="action-btn info"
                                                    title="Informações"
                                                    aria-label="Informações"
                                                    onClick={() => setInfoFuncionarioIdx(idx)}
                                                >
                                                    <img className="icon" src={iconMap.info} alt="info" />
                                                </button>
                                                <button className="action-btn delete" title="Excluir" aria-label="Excluir">
                                                    <img className="icon" src={iconMap.delete} alt="excluir" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;