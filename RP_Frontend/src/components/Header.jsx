
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuAbierto: false
        };
    }

    // Abrir o cerrar el menú del usuario
    toggleMenu = () => {
        this.setState({
            menuAbierto: !this.state.menuAbierto
        });
    };

    // Cerrar el menú al seleccionar una opción
    cerrarMenu = () => {
        this.setState({
            menuAbierto: false
        });
    };

    // Cerrar sesión
 cerrarSesion = () => {
    localStorage.removeItem("token");

    this.setState({
        menuAbierto: false
    });
};

    render() {

        return (
            <header className="header-container">

                {/* LOGO / NOMBRE DE LA TIENDA */}
                <div className="header-logo">

                    <Link to="/" onClick={this.cerrarMenu}>
                        Retro Passion
                    </Link>

                </div>


                {/* NAVEGACIÓN */}
                <nav className="header-navigation">

                    {/* CATEGORÍAS */}
                    <Link
                        to="/categorias"
                        className="header-link"
                        onClick={this.cerrarMenu}
                    >
                        Categorías
                    </Link>


                    {/* CARRITO */}
                    <Link
                        to="/carrito"
                        className="header-icon-link"
                        aria-label="Ir al carrito"
                        onClick={this.cerrarMenu}
                    >

                        <svg
                            viewBox="0 0 24 24"
                            className="header-icon"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>

                    </Link>


                    {/* MENÚ DEL USUARIO */}
                    <div className="header-user-container">

                        <button
                            className="header-icon-button"
                            onClick={this.toggleMenu}
                            aria-label="Abrir menú de usuario"
                            aria-expanded={this.state.menuAbierto}
                            aria-haspopup="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                className="header-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M5 21a7 7 0 0 1 14 0" />
                            </svg>

                        </button>


                        {/* DESPLEGABLE */}
                        {this.state.menuAbierto && (

                            <div className="header-dropdown">

                                <Link
                                    to="/perfil"
                                    onClick={this.cerrarMenu}
                                >
                                    Mi perfil
                                </Link>

                              <Link
                                    to="/login"
                                    onClick={this.cerrarSesion}
                                    >
                                    Cerrar sesión
                            </Link>

                            </div>

                        )}

                    </div>

                </nav>

            </header>
        );
    }
}

export default Header;
