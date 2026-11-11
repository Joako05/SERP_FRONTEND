
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

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

// Componente principal
class App extends Component {

    render() {
        return (
            <BrowserRouter>

                <div className="app-container">

                    {/* Encabezado persistente */}
                    <Header />

                    {/* Contenido de las distintas vistas */}
                    <main className="main-content">

                        <Routes>

                            <Route path="/" element={<Menu />} />

                            <Route path="/signup" element={<Signup />} />

                            <Route path="/login" element={<Login />} />

                            <Route path="/categorias" element={<Categorias />} />

                            <Route path="/producto/:id" element={<Producto />} />

                            <Route path="/carrito" element={<Carrito />} />

                            <Route path="/pedidos" element={<Pedidos />} />

                            <Route path="/mispedidos" element={<Mispedidos />} />

                            <Route path="/perfil" element={<Perfil />} />

                            <Route path="/paneladmin" element={<PanelAdmin />} />

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
