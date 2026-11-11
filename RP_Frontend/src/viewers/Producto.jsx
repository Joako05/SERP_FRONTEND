
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { obtenerProductos } from "../data/Productos";

class Producto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            producto: null,
            mensaje: "",
            tipoMensaje: "",
            preparandoPedido: false,
            redirigirPedido: false,
            rutaActual: ""
        };

        this.timerPreparacion = null;
    }

componentDidMount() {
    this.cargarProducto();
}

componentDidUpdate() {
    const rutaActual = window.location.pathname;

    if (rutaActual !== this.state.rutaActual) {
        this.cargarProducto();
    }
}

cargarProducto = () => {
    const rutaActual = window.location.pathname;
    const id = Number(rutaActual.split("/").pop());

    const productosActuales = obtenerProductos();

    const productoEncontrado = productosActuales.find(
        producto => producto.id === id
    );

    this.setState({
        producto: productoEncontrado || false,
        rutaActual
    });
};

    componentWillUnmount() {
        if (this.timerPreparacion) {
            clearTimeout(this.timerPreparacion);
        }
    }

    agregarAlCarrito = () => {
        const { producto } = this.state;

        if (!producto) return;

        try {
            const carritoGuardado = localStorage.getItem("carrito");
            const carrito = carritoGuardado
                ? JSON.parse(carritoGuardado)
                : [];

            const productoEnCarrito = carrito.find(
                item => item.id === producto.id
            );

            const cantidadActual = productoEnCarrito
                ? productoEnCarrito.cantidad
                : 0;

            if (cantidadActual >= producto.stock) {
                this.setState({
                    mensaje: "No hay más unidades disponibles para agregar.",
                    tipoMensaje: "error"
                });
                return;
            }

            if (productoEnCarrito) {
                productoEnCarrito.cantidad += 1;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            this.setState({
                mensaje: "¡Producto agregado al carrito correctamente!",
                tipoMensaje: "exito"
            });

        } catch (error) {
            this.setState({
                mensaje: "No se pudo agregar el producto al carrito.",
                tipoMensaje: "error"
            });
        }
    };

    comprarAhora = () => {
        const { producto } = this.state;

        if (!producto) return;

        try {
            const carritoGuardado = localStorage.getItem("carrito");
            const carrito = carritoGuardado
                ? JSON.parse(carritoGuardado)
                : [];

            const productoEnCarrito = carrito.find(
                item => item.id === producto.id
            );

            const cantidadActual = productoEnCarrito
                ? productoEnCarrito.cantidad
                : 0;

            if (cantidadActual >= producto.stock) {
                this.setState({
                    mensaje: "No hay más unidades disponibles de este producto.",
                    tipoMensaje: "error"
                });
                return;
            }

            if (productoEnCarrito) {
                productoEnCarrito.cantidad += 1;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            this.setState({
                preparandoPedido: true,
                mensaje: "",
                tipoMensaje: ""
            });

            this.timerPreparacion = setTimeout(() => {
                this.setState({
                    preparandoPedido: false,
                    redirigirPedido: true
                });
            }, 2000);

        } catch (error) {
            this.setState({
                mensaje: "No se pudo preparar tu pedido. Intentá nuevamente.",
                tipoMensaje: "error"
            });
        }
    };

    render() {
        const {
            producto,
            mensaje,
            tipoMensaje,
            preparandoPedido,
            redirigirPedido,
        } = this.state;

        if (redirigirPedido) {
            return <Navigate to="/pedidos" replace />;
        }

        if (preparandoPedido) {
            return (
                <main className="producto-loading-order">
                    <div className="producto-loading-content">
                        <div className="producto-spinner"></div>

                        <h1>Preparando tu pedido</h1>

                        <p>
                            Estamos organizando tu compra. Un momento, por favor...
                        </p>
                    </div>
                </main>
            );
        }

        if (producto === null) {
            return (
                <main className="producto-container">
                    <p className="producto-loading">
                        Cargando producto...
                    </p>
                </main>
            );
        }

        if (producto === false) {
            return (
                <main className="producto-container">
                    <div className="producto-no-encontrado">
                        <h1>Producto no encontrado</h1>
                        <p>El producto que buscás no está disponible.</p>

                        <Link to="/categorias">
                            Volver a categorías
                        </Link>
                    </div>
                </main>
            );
        }

        return (
            <main className="producto-container">

                <div className="producto-content">

                    <section className="producto-left">

                        <div className="producto-image-container">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                            />
                        </div>

                        <div className="producto-price-stock">

                            <div className="producto-price">
                                <span>Precio</span>

                                <strong>
                                    ${producto.precio.toLocaleString("es-AR")}
                                </strong>
                            </div>

                            <div className="producto-stock">
                                <span>Disponibilidad</span>

                                <strong>
                                    {producto.stock > 0
                                        ? `${producto.stock} unidades disponibles`
                                        : "Sin stock"}
                                </strong>
                            </div>

                        </div>

                    </section>

                    <section className="producto-right">

                        <span className="producto-category">
                            {producto.categoria}
                        </span>

                        <h1>{producto.nombre}</h1>

                        <div className="producto-description">
                            <h2>Descripción</h2>
                            <p>{producto.descripcion}</p>
                        </div>

                        <div className="producto-actions">

                            <button
                                className="producto-buy-button"
                                onClick={this.comprarAhora}
                                disabled={producto.stock <= 0}
                            >
                                Comprar ahora
                            </button>

                            <button
                                className="producto-cart-button"
                                onClick={this.agregarAlCarrito}
                                disabled={producto.stock <= 0}
                            >
                                Añadir al carrito
                            </button>

                        </div>

                        {mensaje && (
                            <p className={`producto-message ${tipoMensaje}`}>
                                {mensaje}
                            </p>
                        )}

                        <Link
                            to="/categorias"
                            className="producto-back-link"
                        >
                            ← Volver a categorías
                        </Link>

                    </section>

                </div>

            </main>
        );
    }
}

export default Producto;
