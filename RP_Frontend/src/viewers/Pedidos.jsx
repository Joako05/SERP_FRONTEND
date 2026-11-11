
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

import {
    obtenerPedidos,
    guardarPedidos,
    generarIdPedido
} from "../data/Pedidos";

import { obtenerUsuarioActivo } from "../data/Usuarios";

class Pedidos extends Component {

constructor(props) {
    super(props);

    this.state = {
        productos: this.obtenerCarrito(),
        direccion: localStorage.getItem("direccionEntrega") || "",
        metodoPago: "debito",
        mensajeError: "",
        pagoRealizado: false,
        usuario: obtenerUsuarioActivo(),
        pedidoId: null
    };

    }

    obtenerCarrito = () => {
        try {
            const carritoGuardado = localStorage.getItem("carrito");
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            return [];
        }
    };

    handleDireccion = (event) => {
        this.setState({
            direccion: event.target.value,
            mensajeError: ""
        });
    };
    handleMetodoPago = (event) => {
    this.setState({
        metodoPago: event.target.value,
        mensajeError: ""
    });
};

    calcularTotal = () => {
        return this.state.productos.reduce(
            (total, producto) =>
                total + producto.precio * producto.cantidad,
            0
        );
    };


finalizarCompra = () => {

    const {
        direccion,
        productos,
        metodoPago
    } = this.state;

    // Comprobamos que exista una sesión activa.
    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        this.setState({
            usuario: null,
            mensajeError: "Necesitás iniciar sesión para realizar una compra."
        });
        return;
    }

    if (productos.length === 0) {
        this.setState({
            mensajeError: "No hay productos para comprar."
        });
        return;
    }

    if (!direccion.trim()) {
        this.setState({
            mensajeError: "Ingresá tu dirección de entrega para continuar."
        });
        return;
    }

    const total = productos.reduce(
        (acumulado, producto) =>
            acumulado +
            Number(producto.precio) * Number(producto.cantidad),
        0
    );

    if (
        !Number.isFinite(total) ||
        total <= 0 ||
        productos.some(producto =>
            !Number.isFinite(Number(producto.precio)) ||
            Number(producto.precio) <= 0 ||
            !Number.isInteger(Number(producto.cantidad)) ||
            Number(producto.cantidad) <= 0
        )
    ) {
        this.setState({
            mensajeError: "Los productos del carrito contienen datos inválidos."
        });
        return;
    }

    try {

        // Recuperamos los pedidos existentes.
        const pedidosActuales = obtenerPedidos();

        // Creamos una copia de los productos comprados.
        const productosPedido = productos.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: Number(producto.cantidad),
            imagen: producto.imagen || ""
        }));

        // Construimos el nuevo pedido.
        const nuevoPedido = {
            id: generarIdPedido(pedidosActuales),

            usuarioId: usuario.id,

            cliente: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo
            },

            productos: productosPedido,

            direccion: direccion.trim(),

            metodoPago,

            total,

            fecha: new Date().toISOString(),

            estado: "Pendiente"
        };

        // Guardamos el pedido antes de vaciar el carrito.
        const guardado = guardarPedidos([
            ...pedidosActuales,
            nuevoPedido
        ]);

        if (!guardado) {
            this.setState({
                mensajeError: "No se pudo registrar el pedido. Intentá nuevamente."
            });
            return;
        }

        // Guardamos los datos de entrega y pago.
        localStorage.setItem(
            "direccionEntrega",
            direccion.trim()
        );

        localStorage.setItem(
            "metodoPago",
            metodoPago
        );

        // Simulación de pago: no se realiza ningún cobro real.
        // El carrito se elimina solamente después de guardar el pedido.
        localStorage.removeItem("carrito");

        this.setState({
            pagoRealizado: true,
            pedidoId: nuevoPedido.id,
            mensajeError: ""
        });

    } catch (error) {

        console.error("Error al finalizar la compra:", error);

        this.setState({
            mensajeError: "Ocurrió un error al procesar el pedido. Intentá nuevamente."
        });
    }
};

    render() {

        const {
            productos,
            direccion,
            mensajeError,
            pagoRealizado
        } = this.state;
    if (!this.state.usuario) {
        return <Navigate to="/login" replace />;
    }

if (pagoRealizado) {
    return (
        <main className="pedido-success-container">
            <div className="pedido-success-card">

                <div className="pedido-success-icon">
                    ✓
                </div>

                <h1>¡Compra realizada!</h1>

                <p>
                    Tu pedido fue registrado correctamente.
                </p>

                <p>
                    Número de pedido:{" "}
                    <strong>#{this.state.pedidoId}</strong>
                </p>

                <Link
                    to="/mispedidos"
                    className="pedido-success-button"
                >
                    Ver mis pedidos
                </Link>

                <Link
                    to="/"
                    className="pedido-back-link"
                >
                    Volver al inicio
                </Link>

            </div>
        </main>
    );
}

        if (productos.length === 0) {
            return (
                <main className="pedido-empty-container">
                    <div>
                        <h1>No hay productos en tu pedido</h1>
                        <p>Agregá productos al carrito para continuar.</p>

                        <Link to="/categorias">
                            Explorar productos
                        </Link>
                    </div>
                </main>
            );
        }

        return (
            <main className="pedido-container">

                <h1 className="pedido-title">Tu pedido</h1>

                <div className="pedido-content">

                    {/* COLUMNA IZQUIERDA */}

                    <section className="pedido-details">

                        <div className="pedido-section">

                            <h2>Productos</h2>

                            <div className="pedido-products-list">

                                {productos.map(producto => (

                                    <article
                                        className="pedido-product"
                                        key={producto.id}
                                    >

                                        <div className="pedido-product-image">
                                            <img
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                            />
                                        </div>

                                        <div className="pedido-product-info">
                                            <h3>{producto.nombre}</h3>

                                            <p>
                                                Cantidad: {producto.cantidad}
                                            </p>

                                            <strong>
                                                ${(
                                                    producto.precio *
                                                    producto.cantidad
                                                ).toLocaleString("es-AR")}
                                            </strong>
                                        </div>

                                    </article>

                                ))}

                            </div>

                        </div>

                        
                        <div className="pedido-section">

                            <h2>Método de pago</h2>

                            <div className="pedido-payment-options">

                                <label className="pedido-payment-method">

                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value="debito"
                                        checked={this.state.metodoPago === "debito"}
                                        onChange={this.handleMetodoPago}
                                    />

                                    <div className="pedido-payment-info">
                                        <strong>Tarjeta de débito</strong>
                                        <p>Pago con tarjeta de débito</p>
                                    </div>

                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <rect
                                            x="2"
                                            y="5"
                                            width="20"
                                            height="14"
                                            rx="2"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <path
                                            d="M2 10h20"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                    </svg>

                                </label>

                                <label className="pedido-payment-method">

                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value="credito"
                                        checked={this.state.metodoPago === "credito"}
                                        onChange={this.handleMetodoPago}
                                    />

                                    <div className="pedido-payment-info">
                                        <strong>Tarjeta de crédito</strong>
                                        <p>Pago con tarjeta de crédito</p>
                                    </div>

                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <rect
                                            x="2"
                                            y="5"
                                            width="20"
                                            height="14"
                                            rx="2"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <path
                                            d="M2 10h20"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                    </svg>

                                </label>

                            </div>

                        </div>

                        <div className="pedido-section">

                            <h2>Dirección de entrega</h2>

                            <label
                                className="pedido-address-label"
                                htmlFor="direccionEntrega"
                            >
                                Ingresá tu dirección
                            </label>

                            <textarea
                                id="direccionEntrega"
                                className="pedido-address-input"
                                placeholder="Ej.: Av. San Martín 1234, Ushuaia, Tierra del Fuego"
                                value={direccion}
                                onChange={this.handleDireccion}
                                rows="3"
                            />

                        </div>

                    </section>

                    {/* COLUMNA DERECHA */}

                    <aside className="pedido-summary">

                        <h2>Resumen de compra</h2>

                        <div className="pedido-summary-row">
                            <span>Productos</span>

                            <strong>
                                {productos.reduce(
                                    (total, producto) =>
                                        total + producto.cantidad,
                                    0
                                )}
                            </strong>
                        </div>

                        <div className="pedido-summary-row">
                            <span>Subtotal</span>

                            <strong>
                                ${this.calcularTotal().toLocaleString("es-AR")}
                            </strong>
                        </div>

                        <div className="pedido-summary-row">
                            <span>Envío</span>
                            <strong>A calcular</strong>
                        </div>

                        <div className="pedido-summary-total">
                            <span>Total</span>

                            <strong>
                                ${this.calcularTotal().toLocaleString("es-AR")}
                            </strong>
                        </div>

                        {mensajeError && (
                            <p className="pedido-error">
                                {mensajeError}
                            </p>
                        )}

                        <button
                            className="pedido-pay-button"
                            onClick={this.finalizarCompra}
                        >
                            Pagar y finalizar
                        </button>

                        <Link
                            to="/carrito"
                            className="pedido-back-link"
                        >
                            Volver al carrito
                        </Link>

                    </aside>

                </div>

            </main>
        );
    }
}

export default Pedidos;
