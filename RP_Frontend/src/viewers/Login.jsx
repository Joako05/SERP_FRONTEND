
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    obtenerUsuarios,
    verificarCredenciales,
    guardarSesion
} from "../data/Usuarios";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            correo: "",
            password: "",
            error: "",
            exito: "",
            cargando: false,
            redirigir: false
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
            error: "",
            exito: ""
        });
    };

    validarFormulario = () => {
        const { correo, password } = this.state;

        if (!correo.trim() || !password) {
            return "Completá todos los campos para continuar.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(correo)) {
            return "Ingresá un correo electrónico válido.";
        }

        return null;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.cargando) {
            return;
        }

        const error = this.validarFormulario();

        if (error) {
            this.setState({ error, exito: "" });
            return;
        }

        this.setState({
            cargando: true,
            error: "",
            exito: ""
        });

        try {
            const correoNormalizado = this.state.correo.trim().toLowerCase();
            const password = this.state.password;

            const usuarios = obtenerUsuarios();

            const usuarioEncontrado = usuarios.find(
                usuario =>
                    usuario.correo?.toLowerCase() === correoNormalizado
            );

            if (!usuarioEncontrado) {
                this.setState({
                    cargando: false,
                    error: "El correo electrónico o la contraseña son incorrectos."
                });
                return;
            }

            const credencialesValidas = await verificarCredenciales(
                password,
                usuarioEncontrado
            );

            if (!credencialesValidas) {
                this.setState({
                    cargando: false,
                    error: "El correo electrónico o la contraseña son incorrectos."
                });
                return;
            }

            const sesionGuardada = guardarSesion(usuarioEncontrado);

            if (!sesionGuardada) {
                this.setState({
                    cargando: false,
                    error: "No se pudo iniciar la sesión. Intentá nuevamente."
                });
                return;
            }

            this.setState({
                cargando: false,
                error: "",
                exito: "¡Inicio de sesión correcto!",
                redirigir: true
            });

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);

            this.setState({
                cargando: false,
                error: "No se pudo procesar el inicio de sesión. Intentá nuevamente."
            });
        }
    };

    render() {
        const {
            correo,
            password,
            error,
            exito,
            cargando,
            redirigir
        } = this.state;

        if (redirigir) {
            return <Navigate to="/" replace />;
        }

        return (
            <section className="login-container">
                <div className="login-card">

                    <div className="login-header">
                        <h1>Iniciar sesión</h1>
                        <p>Ingresá a tu cuenta de Retro Passion</p>
                    </div>

                    <form onSubmit={this.handleSubmit}>

                        <div className="login-field">
                            <label htmlFor="correo">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="ejemplo@correo.com"
                                value={correo}
                                onChange={this.handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={this.handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <p className="login-message login-error">
                                {error}
                            </p>
                        )}

                        {exito && (
                            <p className="login-message login-success">
                                {exito}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={cargando}
                        >
                            {cargando ? "Ingresando..." : "Iniciar sesión"}
                        </button>

                    </form>

                    <div className="login-signup-link">
                        <p>
                            ¿Todavía no tenés una cuenta?{" "}
                            <Link to="/signup">Registrate</Link>
                        </p>
                    </div>

                </div>
            </section>
        );
    }
}

export default Login;
