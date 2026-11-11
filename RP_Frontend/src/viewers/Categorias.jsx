
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos } from "../data/Productos";
import { obtenerCategorias } from "../data/Categorias";

class Categorias extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categoriaActiva: "todas",
            categorias: [],
            productos: []
        };
    }

        componentDidMount() {
            this.setState({
                categorias: obtenerCategorias(),
                productos: obtenerProductos()
            });
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

        const productosCategoria = this.state.productos.filter(
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

                        <p>
                            {categoria.descripcion ||
                                "Descubrí los productos de esta categoría."}
                        </p>
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

                const {
                    categoriaActiva,
                    categorias,
                    productos
                    } = this.state;

        const categoriasVisibles =
            categoriaActiva === "todas"
                ? categorias
                : categorias.filter(
                    categoria => categoria.id === categoriaActiva
                );

        return (
            <div className="categorias-container">

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

                    {categorias.length > 0 ? (
                        categoriasVisibles.map(categoria =>
                            this.renderSeccionCategoria(categoria)
                        )
                    ) : (
                        <div className="categorias-empty">
                            <h2>No hay categorías disponibles</h2>
                            <p>
                                Próximamente agregaremos nuevas categorías.
                            </p>
                        </div>
                    )}

                </div>

            </div>
        );
    }
}

export default Categorias;