
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

import {
    obtenerUsuarioActivo,
    obtenerUsuarios,
    actualizarDatosUsuario
} from "../data/Usuarios";

class Perfil extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usuario: obtenerUsuarioActivo(),
            editando: false,
            mensaje: "",
            tipoMensaje: ""
        };
    }

    // Escuchar cambios en la sesión
    componentDidMount() {
        window.addEventListener(
            "sesionActualizada",
            this.actualizarUsuario
        );
    }

    // Dejar de escuchar al desmontar el componente
    componentWillUnmount() {
        window.removeEventListener(
            "sesionActualizada",
            this.actualizarUsuario
        );
    }

    // Obtener nuevamente los datos del usuario activo
    actualizarUsuario = () => {
        this.setState({
            usuario: obtenerUsuarioActivo(),
            editando: false,
            mensaje: "",
            tipoMensaje: ""
        });
    };

    // Actualizar un campo del formulario
    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({
            usuario: {
                ...this.state.usuario,
                [name]: value
            },
            mensaje: "",
            tipoMensaje: ""
        });
    };

    // Activar el modo de edición
    editarPerfil = () => {
        this.setState({
            editando: true,
            mensaje: "",
            tipoMensaje: ""
        });
    };

    // Cancelar la edición y recuperar los datos originales
    cancelarEdicion = () => {
        this.setState({
            usuario: obtenerUsuarioActivo(),
            editando: false,
            mensaje: "",
            tipoMensaje: ""
        });
    };

    // Guardar los cambios del perfil
    guardarCambios = (event) => {
        event.preventDefault();

        const { usuario } = this.state;

        if (!usuario) {
            this.setState({
                mensaje: "No se encontró una sesión activa.",
                tipoMensaje: "error"
            });
            return;
        }

        // Validar campos obligatorios
        if (
            !usuario.nombre.trim() ||
            !usuario.apellido.trim() ||
            !usuario.correo.trim() ||
            !usuario.telefono.trim() ||
            !usuario.direccion.trim()
        ) {
            this.setState({
                mensaje: "Todos los campos son obligatorios.",
                tipoMensaje: "error"
            });
            return;
        }

        // Normalizar el correo
        const correo = usuario.correo.trim().toLowerCase();

        // Validar formato del correo
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!emailValido) {
            this.setState({
                mensaje: "Ingresá un correo electrónico válido.",
                tipoMensaje: "error"
            });
            return;
        }

        // Comprobar que el correo no pertenezca a otro usuario
        const usuariosRegistrados = obtenerUsuarios();

        const correoExistente = usuariosRegistrados.some(
            usuarioRegistrado =>
                String(usuarioRegistrado.id) !== String(usuario.id) &&
                usuarioRegistrado.correo.trim().toLowerCase() === correo
        );

        if (correoExistente) {
            this.setState({
                mensaje: "Ese correo electrónico ya está registrado.",
                tipoMensaje: "error"
            });
            return;
        }

        // Preparar los datos que se pueden modificar
        const datosActualizados = {
            nombre: usuario.nombre.trim(),
            apellido: usuario.apellido.trim(),
            correo: correo,
            telefono: usuario.telefono.trim(),
            direccion: usuario.direccion.trim()
        };

        try {

            // Actualizar el registro dentro de Usuarios.js
            actualizarDatosUsuario(usuario.id, datosActualizados);

            // Recuperar los datos actualizados
            const usuarioActualizado = obtenerUsuarioActivo();

            // Verificar que los cambios se hayan guardado
            const cambiosGuardados =
                usuarioActualizado &&
                usuarioActualizado.nombre === datosActualizados.nombre &&
                usuarioActualizado.apellido === datosActualizados.apellido &&
                usuarioActualizado.correo === datosActualizados.correo &&
                usuarioActualizado.telefono === datosActualizados.telefono &&
                usuarioActualizado.direccion === datosActualizados.direccion;

            if (!cambiosGuardados) {
                throw new Error("No se pudieron verificar los cambios.");
            }

            // Mantener sincronizada la dirección utilizada en el checkout
            localStorage.setItem(
                "direccionEntrega",
                datosActualizados.direccion
            );

            this.setState({
                usuario: usuarioActualizado,
                editando: false,
                mensaje: "¡Tu información se actualizó correctamente!",
                tipoMensaje: "exito"
            });

        } catch (error) {

            this.setState({
                mensaje: "No se pudieron guardar los cambios.",
                tipoMensaje: "error"
            });

        }
    };

    render() {

        const {
            usuario,
            editando,
            mensaje,
            tipoMensaje
        } = this.state;

        // Si no existe una sesión activa, volver al login
        if (!usuario) {
            return <Navigate to="/login" replace />;
        }

        // Mostrar un dato o indicar que no está disponible
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
                            Consultá y administrá la información
                            personal de tu cuenta.
                        </p>

                    </header>

                    <form onSubmit={this.guardarCambios}>

                        {/* INFORMACIÓN PERSONAL */}

                        <section className="perfil-section">

                            <div className="perfil-section-header">
                                <h2>Información personal</h2>
                            </div>

                            <div className="perfil-data-grid">

                                <div className="perfil-data-item">

                                    <label htmlFor="nombre">
                                        Nombre
                                    </label>

                                    {editando ? (
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            value={usuario.nombre}
                                            onChange={this.handleChange}
                                            placeholder="Ingresá tu nombre"
                                        />
                                    ) : (
                                        <strong>
                                            {mostrarDato(usuario.nombre)}
                                        </strong>
                                    )}

                                </div>

                                <div className="perfil-data-item">

                                    <label htmlFor="apellido">
                                        Apellido
                                    </label>

                                    {editando ? (
                                        <input
                                            type="text"
                                            id="apellido"
                                            name="apellido"
                                            value={usuario.apellido}
                                            onChange={this.handleChange}
                                            placeholder="Ingresá tu apellido"
                                        />
                                    ) : (
                                        <strong>
                                            {mostrarDato(usuario.apellido)}
                                        </strong>
                                    )}

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

                                    <label htmlFor="correo">
                                        Correo electrónico
                                    </label>

                                    {editando ? (
                                        <input
                                            type="email"
                                            id="correo"
                                            name="correo"
                                            value={usuario.correo}
                                            onChange={this.handleChange}
                                            placeholder="Ingresá tu correo"
                                        />
                                    ) : (
                                        <strong>
                                            {mostrarDato(usuario.correo)}
                                        </strong>
                                    )}

                                </div>

                                <div className="perfil-data-item">

                                    <label htmlFor="telefono">
                                        Número de teléfono
                                    </label>

                                    {editando ? (
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={usuario.telefono}
                                            onChange={this.handleChange}
                                            placeholder="Ingresá tu teléfono"
                                        />
                                    ) : (
                                        <strong>
                                            {mostrarDato(usuario.telefono)}
                                        </strong>
                                    )}

                                </div>

                                <div className="perfil-data-item perfil-data-full">

                                    <label htmlFor="direccion">
                                        Dirección
                                    </label>

                                    {editando ? (
                                        <textarea
                                            id="direccion"
                                            name="direccion"
                                            value={usuario.direccion}
                                            onChange={this.handleChange}
                                            placeholder="Ingresá tu dirección"
                                            rows="3"
                                        />
                                    ) : (
                                        <strong>
                                            {mostrarDato(usuario.direccion)}
                                        </strong>
                                    )}

                                </div>

                            </div>

                        </section>

                        {/* MENSAJES */}

                        {mensaje && (
                            <p className={`perfil-message ${tipoMensaje}`}>
                                {mensaje}
                            </p>
                        )}

                        {/* ACCIONES */}

                        <div className="perfil-footer">

                            {editando ? (
                                <>

                                    <button
                                        type="button"
                                        className="perfil-cancel-button"
                                        onClick={this.cancelarEdicion}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="perfil-save-button"
                                    >
                                        Guardar cambios
                                    </button>

                                </>
                            ) : (

                                <button
                                    type="button"
                                    className="perfil-edit-button"
                                    onClick={this.editarPerfil}
                                >
                                    Editar información
                                </button>

                            )}

                        </div>

                    </form>

                    {/* SEGURIDAD DE LA CUENTA */}

                    <section className="perfil-section perfil-security">

                        <div className="perfil-section-header">
                            <h2>Seguridad de la cuenta</h2>
                        </div>

                        <div className="perfil-security-content">

                            <div>
                                <strong>Contraseña</strong>

                                <p>
                                    Protegé tu cuenta manteniendo
                                    tu contraseña actualizada.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="perfil-password-button"
                                disabled
                                title="Disponible cuando conectemos el backend"
                            >
                                Cambiar contraseña
                            </button>

                        </div>

                        <p className="perfil-security-note">
                            Esta opción estará disponible cuando
                            conectemos el sistema de autenticación.
                        </p>

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
