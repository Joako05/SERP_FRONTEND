
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { obtenerPedidos } from "../data/Pedidos";
import { obtenerUsuarioActivo } from "../data/Usuarios";
import "./Mispedidos.css";

class MisPedidos extends Component {

constructor(props) {
    super(props);

    this.state = {
        usuario: obtenerUsuarioActivo(),
        pedidos: []
    };
}

componentDidMount() {
    const { usuario } = this.state;

    if (!usuario) {
        return;
    }

    const todosLosPedidos = obtenerPedidos();

    const pedidosDelUsuario = todosLosPedidos
        .filter(
            pedido => Number(pedido.usuarioId) === Number(usuario.id)
        )
        .sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );

    this.setState({
        pedidos: pedidosDelUsuario
    });
}


    formatearFecha = (fecha) => {
        if (!fecha) {
            return "Fecha no disponible";
        }

        const fechaPedido = new Date(fecha);

        if (Number.isNaN(fechaPedido.getTime())) {
            return "Fecha no disponible";
        }

        return fechaPedido.toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    formatearPrecio = (precio) => {
        return Number(precio || 0).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 2
        });
    };

    obtenerClaseEstado = (estado) => {
        switch (estado) {
            case "Pendiente":
                return "estado-pendiente";

            case "En preparación":
                return "estado-preparacion";

            case "Enviado":
                return "estado-enviado";

            case "Entregado":
                return "estado-entregado";

            case "Cancelado":
                return "estado-cancelado";

            default:
                return "";
        }
    };

    render() {
        const { usuario, pedidos } = this.state;

        if (!usuario) {
            return <Navigate to="/login" replace />;
        }

        return (
            <section className="mis-pedidos-container">

                <div className="mis-pedidos-header">
                    <div>
                        <h1>Mis pedidos</h1>
                        <p>
                            Hola, {usuario.nombre}. Acá podés consultar
                            el historial de tus compras.
                        </p>
                    </div>

                    <Link to="/categorias" className="volver-tienda">
                        Seguir comprando
                    </Link>
                </div>

                {pedidos.length === 0 ? (

                    <div className="mis-pedidos-vacio">
                        <h2>Todavía no realizaste compras</h2>

                        <p>
                            Cuando completes tu primera compra,
                            vas a poder consultar su información desde acá.
                        </p>

                        <Link to="/categorias">
                            Explorar productos
                        </Link>
                    </div>

                ) : (

                    <div className="lista-mis-pedidos">

                        {pedidos.map(pedido => (

                            <article
                                className="pedido-card"
                                key={pedido.id}
                            >

                                <div className="pedido-card-header">

                                    <div>
                                        <h2>Pedido #{pedido.id}</h2>

                                        <p>
                                            {this.formatearFecha(pedido.fecha)}
                                        </p>
                                    </div>

                                    <span
                                        className={`pedido-estado ${this.obtenerClaseEstado(pedido.estado)}`}
                                    >
                                        {pedido.estado || "Pendiente"}
                                    </span>

                                </div>

                                <div className="pedido-productos">

                                    {pedido.productos.map((producto, index) => (

                                        <div
                                            className="pedido-producto"
                                            key={`${pedido.id}-${producto.id}-${index}`}
                                        >

                                            {producto.imagen && (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                />
                                            )}

                                            <div className="pedido-producto-info">
                                                <h3>{producto.nombre}</h3>

                                                <p>
                                                    Cantidad: {producto.cantidad}
                                                </p>

                                                <p>
                                                    Precio unitario:{" "}
                                                    {this.formatearPrecio(producto.precio)}
                                                </p>
                                            </div>

                                            <strong>
                                                {this.formatearPrecio(
                                                    Number(producto.precio) *
                                                    Number(producto.cantidad)
                                                )}
                                            </strong>

                                        </div>

                                    ))}

                                </div>

                                <div className="pedido-card-footer">

                                    <div>
                                        <p>
                                            <strong>Dirección:</strong>{" "}
                                            {pedido.direccion}
                                        </p>

                                        <p>
                                            <strong>Pago:</strong>{" "}
                                            {pedido.metodoPago}
                                        </p>
                                    </div>

                                    <div className="pedido-total">
                                        <span>Total</span>
                                        <strong>
                                            {this.formatearPrecio(pedido.total)}
                                        </strong>
                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>
        );
    }
}

export default MisPedidos;
