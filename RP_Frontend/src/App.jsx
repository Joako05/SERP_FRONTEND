
import React, { Component } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";

import "./App.css";

// Funciones de autenticación y autorización
import {
    obtenerUsuarioActivo,
    esAdministrador
} from "./data/Usuarios";

// Componentes persistentes
import Header from "./components/header";
import Footer from "./components/footer";

// Importación de vistas
import Signup from "./viewers/Signup";
import Login from "./viewers/Login";
import Menu from "./viewers/menu";
import Categorias from "./viewers/categorias";
import Producto from "./viewers/producto";
import Carrito from "./viewers/carrito";
import Pedidos from "./viewers/pedidos";
import Mispedidos from "./viewers/Mispedidos";
import Perfil from "./viewers/perfil";
import PanelAdmin from "./viewers/paneladmin";

// ==========================================
// PROTECCIÓN DE RUTAS PARA USUARIOS
// ==========================================

class RutaPrivada extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usuario: obtenerUsuarioActivo()
        };
    }

    componentDidMount() {
        window.addEventListener(
            "sesionActualizada",
            this.actualizarUsuario
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            "sesionActualizada",
            this.actualizarUsuario
        );
    }

    actualizarUsuario = () => {
        this.setState({
            usuario: obtenerUsuarioActivo()
        });
    };

    render() {

        if (!this.state.usuario) {
            return <Navigate to="/login" replace />;
        }

        return <Outlet />;
    }
}

// ==========================================
// PROTECCIÓN DE RUTAS PARA ADMINISTRADORES
// ==========================================

class RutaAdmin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            administrador: esAdministrador()
        };
    }

    componentDidMount() {
        window.addEventListener(
            "sesionActualizada",
            this.actualizarPermisos
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            "sesionActualizada",
            this.actualizarPermisos
        );
    }

    actualizarPermisos = () => {
        this.setState({
            administrador: esAdministrador()
        });
    };

    render() {

        if (!this.state.administrador) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

class App extends Component {

    render() {

        return (
            <BrowserRouter>

                <div className="app-container">

                    {/* Encabezado persistente */}
                    <Header />

                    <main className="main-content">

                        <Routes>

                            {/* RUTAS PÚBLICAS */}

                            <Route
                                path="/"
                                element={<Menu />}
                            />

                            <Route
                                path="/signup"
                                element={<Signup />}
                            />

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/categorias"
                                element={<Categorias />}
                            />

                            <Route
                                path="/producto/:id"
                                element={<Producto />}
                            />

                            <Route
                                path="/carrito"
                                element={<Carrito />}
                            />

                            {/* RUTAS PRIVADAS */}

                            <Route element={<RutaPrivada />}>

                                <Route
                                    path="/pedidos"
                                    element={<Pedidos />}
                                />

                                <Route
                                    path="/mispedidos"
                                    element={<Mispedidos />}
                                />

                                <Route
                                    path="/perfil"
                                    element={<Perfil />}
                                />

                                {/* RUTA EXCLUSIVA PARA ADMINISTRADORES */}

                                <Route element={<RutaAdmin />}>

                                    <Route
                                        path="/paneladmin"
                                        element={<PanelAdmin />}
                                    />

                                </Route>

                            </Route>

                        </Routes>

                    </main>

                    {/* Pie de página persistente */}
                    <Footer />

                </div>

            </BrowserRouter>
        );
    }
}

export default App;
