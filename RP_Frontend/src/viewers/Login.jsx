
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            correo: "",
            password: "",
            error: "",
            exito: ""
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

    handleSubmit = (e) => {
        e.preventDefault();

        const error = this.validarFormulario();

        if (error) {
            this.setState({
                error,
                exito: ""
            });

            return;
        }

        // Simulación local: todavía no se inicia una sesión real.
        this.setState({
            error: "",
            exito: "¡Datos validados correctamente! El inicio de sesión estará disponible próximamente."
        });
    };

    render() {
        const {
            correo,
            password,
            error,
            exito
        } = this.state;

        return (
            <section className="login-container">
                <div className="login-card">

                    <div className="login-header">
                        <h1>Bienvenido nuevamente</h1>
                        <p>Ingresá a tu cuenta de Retro Passion</p>
                    </div>

                    <form onSubmit={this.handleSubmit}>

                        <div className="login-field">
                            <label htmlFor="correo">
                                Correo electrónico
                            </label>

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
                            <label htmlFor="password">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Ingresá tu contraseña"
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
                        >
                            Iniciar sesión
                        </button>

                    </form>

                    <div className="login-signup-link">
                        <p>
                            ¿Todavía no tenés una cuenta?{" "}
                            <Link to="/signup">
                                Registrate
                            </Link>
                        </p>
                    </div>

                </div>
            </section>
        );
    }
}

export default Login;
