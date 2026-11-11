
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

class Carrito extends Component {

    constructor(props) {
        super(props);

        this.state = {
            productos: this.obtenerCarrito(),
            preparandoPedido: false,
            redirigirPedido: false
        };

        this.timerPreparacion = null;
    }

    obtenerCarrito = () => {
        try {
            const carritoGuardado = localStorage.getItem("carrito");
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            return [];
        }
    };

    guardarCarrito = (productos) => {
        localStorage.setItem("carrito", JSON.stringify(productos));

        this.setState({
            productos: productos
        });
    };

    aumentarCantidad = (id) => {
        const productos = [...this.state.productos];

        const producto = productos.find(item => item.id === id);

        if (!producto) return;

        if (producto.cantidad >= producto.stock) return;

        producto.cantidad += 1;

        this.guardarCarrito(productos);
    };

    disminuirCantidad = (id) => {
        const productos = [...this.state.productos];

        const producto = productos.find(item => item.id === id);

        if (!producto) return;

        if (producto.cantidad <= 1) return;

        producto.cantidad -= 1;

        this.guardarCarrito(productos);
    };

    eliminarProducto = (id) => {
        const productosActualizados = this.state.productos.filter(
            producto => producto.id !== id
        );

        this.guardarCarrito(productosActualizados);
    };

    calcularTotal = () => {
        return this.state.productos.reduce(
            (total, producto) =>
                total + producto.precio * producto.cantidad,
            0
        );
    };

    continuarPedido = () => {
        if (this.state.productos.length === 0) return;

        this.setState({
            preparandoPedido: true
        });

        this.timerPreparacion = setTimeout(() => {
            this.setState({
                preparandoPedido: false,
                redirigirPedido: true
            });
        }, 2000);
    };

    componentWillUnmount() {
        if (this.timerPreparacion) {
            clearTimeout(this.timerPreparacion);
        }
    }

    render() {

        const {
            productos,
            preparandoPedido,
            redirigirPedido
        } = this.state;

        if (redirigirPedido) {
            return <Navigate to="/pedidos" replace />;
        }

        if (preparandoPedido) {
            return (
                <main className="carrito-loading">
                    <div className="carrito-loading-content">
                        <div className="carrito-spinner"></div>
                        <h1>Preparando tu pedido</h1>
                        <p>Estamos organizando tus productos...</p>
                    </div>
                </main>
            );
        }

        return (
            <main className="carrito-container">

                <h1 className="carrito-title">Carrito</h1>

                <section className="carrito-content">

                    <div className="carrito-products">

                        <h2>Producto</h2>

                        {productos.length === 0 ? (

                            <div className="carrito-empty">
                                <p>Tu carrito está vacío.</p>
                                <Link to="/categorias">
                                    Explorar productos
                                </Link>
                            </div>

                        ) : (

                            productos.map(producto => (

                                <article
                                    className="carrito-product"
                                    key={producto.id}
                                >

                                    <div className="carrito-product-image">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                        />
                                    </div>

                                    <div className="carrito-product-info">

                                        <h3>{producto.nombre}</h3>

                                        <p className="carrito-product-price">
                                            ${producto.precio.toLocaleString("es-AR")}
                                        </p>

                                        <div className="carrito-quantity">

                                            <button
                                                onClick={() =>
                                                    this.disminuirCantidad(producto.id)
                                                }
                                                disabled={producto.cantidad <= 1}
                                                aria-label="Disminuir cantidad"
                                            >
                                                −
                                            </button>

                                            <span>{producto.cantidad}</span>

                                            <button
                                                onClick={() =>
                                                    this.aumentarCantidad(producto.id)
                                                }
                                                disabled={
                                                    producto.cantidad >= producto.stock
                                                }
                                                aria-label="Aumentar cantidad"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    <div className="carrito-product-actions">

                                        <strong>
                                            ${(
                                                producto.precio * producto.cantidad
                                            ).toLocaleString("es-AR")}
                                        </strong>

                                        <button
                                            className="carrito-delete-button"
                                            onClick={() =>
                                                this.eliminarProducto(producto.id)
                                            }
                                            aria-label={`Eliminar ${producto.nombre}`}
                                            title="Eliminar producto"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                    {productos.length > 0 && (

                        <aside className="carrito-summary">

                            <h2>Resumen del carrito</h2>

                            <div className="carrito-summary-row">
                                <span>Productos</span>
                                <strong>
                                    {productos.reduce(
                                        (total, producto) =>
                                            total + producto.cantidad,
                                        0
                                    )}
                                </strong>
                            </div>

                            <div className="carrito-summary-total">
                                <span>Total</span>
                                <strong>
                                    ${this.calcularTotal().toLocaleString("es-AR")}
                                </strong>
                            </div>

                            <button
                                className="carrito-continue-button"
                                onClick={this.continuarPedido}
                            >
                                Continuar
                            </button>

                            <Link
                                to="/categorias"
                                className="carrito-continue-shopping"
                            >
                                Seguir comprando
                            </Link>

                        </aside>

                    )}

                </section>

            </main>
        );
    }
}

export default Carrito;
