import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/login'
import Dashboard from './pages/dashboard/dashboard';
import DashboardFuncionario from './pages/dashboardFuncionario/dashboardFuncionario';
import DashboardCompras from './pages/dashboardCompras/dashboardCompras';
import { JSX } from 'react';

function RequireAuth({ children, cargo }: { children: JSX.Element, cargo: string }) {
    const token = localStorage.getItem("auth_token");
    const userCargo = localStorage.getItem("cargo");
    if (!token || userCargo !== cargo) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route
                path="/dashboard"
                element={
                    <RequireAuth cargo="Gerente">
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path='/dashboardFun'
                element={
                    <RequireAuth cargo="Estoquista">
                        <DashboardFuncionario />
                    </RequireAuth>
                }
            />
            <Route
                path='/dashboardCom'
                element={
                    <RequireAuth cargo="Comprador">
                        <DashboardCompras />
                    </RequireAuth>
                }
            />
        </Routes>
    )
}

export default App
