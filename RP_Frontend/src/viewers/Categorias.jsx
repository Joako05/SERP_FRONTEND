
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { productos } from "../data/Productos";

// Categorías disponibles
const categorias = [
    {
        id: "superiores",
        nombre: "Prendas superiores",
        descripcion: "Remeras, buzos y camisas para todos los estilos."
    },
    {
        id: "pantalones",
        nombre: "Pantalones",
        descripcion: "Jeans, joggers y pantalones urbanos."
    },
    {
        id: "gorras",
        nombre: "Gorras",
        descripcion: "Complementá tu estilo con nuestros accesorios."
    },
    {
        id: "camperas",
        nombre: "Camperas",
        descripcion: "Diseños únicos para completar tu outfit."
    }
];


class Categorias extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categoriaActiva: "todas"
        };
    }

    seleccionarCategoria = (categoria) => {
        this.setState({
            categoriaActiva: categoria
        });
    };

    renderTarjetaProducto = (producto) => {
        return (
            <Link
                to={`/producto/${producto.id}`}
                className="categoria-product-card"
                key={producto.id}
            >
                <div className="categoria-product-image">
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        loading="lazy"
                    />
                </div>

                <div className="categoria-product-info">
                    <h3>{producto.nombre}</h3>

                    <p className="categoria-product-price">
                        ${producto.precio.toLocaleString("es-AR")}
                    </p>

                    <span className="categoria-product-link">
                        Ver producto
                    </span>
                </div>
            </Link>
        );
    };

    renderSeccionCategoria = (categoria) => {

        const productosCategoria = productos.filter(
            producto => producto.categoria === categoria.id
        );

        return (
            <section
                className="categoria-section"
                key={categoria.id}
            >
                <div className="categoria-section-header">
                    <div>
                        <h2>{categoria.nombre}</h2>
                        <p>{categoria.descripcion}</p>
                    </div>

                    <span>
                        {productosCategoria.length} productos
                    </span>
                </div>

                <div className="categoria-products-grid">
                    {productosCategoria.map(producto =>
                        this.renderTarjetaProducto(producto)
                    )}
                </div>
            </section>
        );
    };

    render() {

        const { categoriaActiva } = this.state;

        const categoriasVisibles =
            categoriaActiva === "todas"
                ? categorias
                : categorias.filter(
                    categoria => categoria.id === categoriaActiva
                );

        return (
            <main className="categorias-container">

                {/* Encabezado */}
                <section className="categorias-hero">
                    <h1>Nuestras categorías</h1>

                    <p>
                        Descubrí todas las prendas y encontrá
                        tu próximo estilo en Retro Passion.
                    </p>
                </section>

                {/* Filtros de categorías */}
                <nav className="categorias-filters">

                    <button
                        className={
                            categoriaActiva === "todas"
                                ? "categoria-filter active"
                                : "categoria-filter"
                        }
                        onClick={() =>
                            this.seleccionarCategoria("todas")
                        }
                    >
                        Todas
                    </button>

                    {categorias.map(categoria => (
                        <button
                            key={categoria.id}
                            className={
                                categoriaActiva === categoria.id
                                    ? "categoria-filter active"
                                    : "categoria-filter"
                            }
                            onClick={() =>
                                this.seleccionarCategoria(categoria.id)
                            }
                        >
                            {categoria.nombre}
                        </button>
                    ))}

                </nav>

                {/* Productos agrupados */}
                <div className="categorias-content">

                    {categoriasVisibles.map(categoria =>
                        this.renderSeccionCategoria(categoria)
                    )}

                </div>

            </main>
        );
    }
}

export default Categorias;
