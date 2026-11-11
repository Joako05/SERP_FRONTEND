
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Pedidos extends Component {

    constructor(props) {
        super(props);

      
this.state = {
    productos: this.obtenerCarrito(),
    direccion: localStorage.getItem("direccionEntrega") || "",
    metodoPago: "debito",
    mensajeError: "",
    pagoRealizado: false
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

        const { direccion, productos } = this.state;

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

        localStorage.setItem("direccionEntrega", direccion.trim());
        localStorage.setItem("metodoPago", this.state.metodoPago);

        // Simulación de pago: no se realiza ningún cobro real.
        localStorage.removeItem("carrito");

        this.setState({
            pagoRealizado: true,
            mensajeError: ""
        });
    };

    render() {

        const {
            productos,
            direccion,
            mensajeError,
            pagoRealizado
        } = this.state;

        if (pagoRealizado) {
            return (
                <main className="pedido-success-container">

                    <div className="pedido-success-card">

                        <div className="pedido-success-icon">
                            ✓
                        </div>

                        <h1>¡Compra realizada!</h1>

                        <p>
                            Pago realizado, gracias por su compra
                        </p>

                        <Link to="/" className="pedido-success-button">
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
