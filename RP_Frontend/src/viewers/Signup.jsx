
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombre: "",
            apellido: "",
            correo: "",
            telefono: "",
            direccion: "",
            password: "",
            confirmarPassword: "",
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
        const {
            nombre,
            apellido,
            correo,
            telefono,
            direccion,
            password,
            confirmarPassword
        } = this.state;

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !correo.trim() ||
            !telefono.trim() ||
            !direccion.trim() ||
            !password ||
            !confirmarPassword
        ) {
            return "Todos los campos son obligatorios.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(correo)) {
            return "Ingresá un correo electrónico válido.";
        }

        const telefonoRegex = /^[0-9+\s()-]{8,20}$/;

        if (!telefonoRegex.test(telefono)) {
            return "Ingresá un número de teléfono válido.";
        }

        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres.";
        }

        if (password !== confirmarPassword) {
            return "Las contraseñas no coinciden.";
        }

        return null;
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const error = this.validarFormulario();

        if (error) {
            this.setState({ error, exito: "" });
            return;
        }

        // Simulación local: todavía no se registra ningún usuario.
        this.setState({
            error: "",
            exito: "¡Formulario validado correctamente! El registro estará disponible próximamente."
        });
    };

    render() {
        const {
            nombre,
            apellido,
            correo,
            telefono,
            direccion,
            password,
            confirmarPassword,
            error,
            exito
        } = this.state;

        return (
            <section className="signup-container">
                <div className="signup-card">

                    <div className="signup-header">
                        <h1>Crear cuenta</h1>
                        <p>Unite a la comunidad Retro Passion</p>
                    </div>

                    <form onSubmit={this.handleSubmit}>

                        <div className="signup-fields-row">
                            <div className="signup-field">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Tu nombre"
                                    value={nombre}
                                    onChange={this.handleChange}
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="signup-field">
                                <label htmlFor="apellido">Apellido</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    placeholder="Tu apellido"
                                    value={apellido}
                                    onChange={this.handleChange}
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div className="signup-field">
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

                        <div className="signup-field">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                placeholder="Tu número de teléfono"
                                value={telefono}
                                onChange={this.handleChange}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="direccion">Dirección</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                placeholder="Tu dirección"
                                value={direccion}
                                onChange={this.handleChange}
                                autoComplete="street-address"
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={this.handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="confirmarPassword">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmarPassword"
                                name="confirmarPassword"
                                placeholder="Repetí tu contraseña"
                                value={confirmarPassword}
                                onChange={this.handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        {error && (
                            <p className="signup-message signup-error">
                                {error}
                            </p>
                        )}

                        {exito && (
                            <p className="signup-message signup-success">
                                {exito}
                            </p>
                        )}

                        <button type="submit" className="signup-button">
                            Crear cuenta
                        </button>

                    </form>

                    <div className="signup-login-link">
                        <p>
                            ¿Ya tenés una cuenta?{" "}
                            <Link to="/login">Iniciá sesión</Link>
                        </p>
                    </div>

                </div>
            </section>
        );
    }
}

export default Signup;
