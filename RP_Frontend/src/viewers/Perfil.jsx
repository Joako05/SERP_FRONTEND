
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Perfil extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usuario: this.obtenerUsuario()
        };
    }

    obtenerUsuario = () => {
        try {
            const usuarioGuardado = localStorage.getItem("usuario");

            if (usuarioGuardado) {
                return JSON.parse(usuarioGuardado);
            }

            return {
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                direccion: ""
            };

        } catch (error) {
            return {
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                direccion: ""
            };
        }
    };

    render() {

        const { usuario } = this.state;

        const mostrarDato = (dato) => {
            return dato && dato.trim() !== ""
                ? dato
                : "No disponible";
        };

        return (
            <main className="perfil-container">

                <div className="perfil-content">

                    <header className="perfil-header">
                        <h1>Información de tu perfil</h1>

                        <p>
                            Consultá la información personal
                            y los datos de tu cuenta.
                        </p>
                    </header>

                    {/* INFORMACIÓN PERSONAL */}

                    <section className="perfil-section">

                        <div className="perfil-section-header">
                            <h2>Información personal</h2>
                        </div>

                        <div className="perfil-data-grid">

                            <div className="perfil-data-item">
                                <span>Nombre</span>

                                <strong>
                                    {mostrarDato(usuario.nombre)}
                                </strong>
                            </div>

                            <div className="perfil-data-item">
                                <span>Apellido</span>

                                <strong>
                                    {mostrarDato(usuario.apellido)}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* DATOS DE LA CUENTA */}

                    <section className="perfil-section">

                        <div className="perfil-section-header">
                            <h2>Datos de la cuenta</h2>
                        </div>

                        <div className="perfil-data-grid">

                            <div className="perfil-data-item">
                                <span>Correo electrónico</span>

                                <strong>
                                    {mostrarDato(usuario.correo)}
                                </strong>
                            </div>

                            <div className="perfil-data-item">
                                <span>Número de teléfono</span>

                                <strong>
                                    {mostrarDato(usuario.telefono)}
                                </strong>
                            </div>

                            <div className="perfil-data-item perfil-data-full">
                                <span>Dirección</span>

                                <strong>
                                    {mostrarDato(
                                        usuario.direccion ||
                                        localStorage.getItem("direccionEntrega")
                                    )}
                                </strong>
                            </div>

                        </div>

                    </section>

                    <div className="perfil-footer">
                        <Link to="/" className="perfil-back-button">
                            Volver al inicio
                        </Link>
                    </div>

                </div>

            </main>
        );
    }
}

export default Perfil;
