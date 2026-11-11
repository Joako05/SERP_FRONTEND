
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Productos destacados
const productosDestacados = [
    {
        id: 1,
        nombre: "Chaqueta de cuero",
        descripcion: "Estilo clásico, actitud atemporal.",
        imagen: "/images/chamarra.jpg"
    },
    {
        id: 2,
        nombre: "Chaqueta urbana",
        descripcion: "Diseños únicos para destacar.",
        imagen: "/images/diseños.jpg"
    },
    {
        id: 3,
        nombre: "Estilo Oversize",
        descripcion: "Comodidad y personalidad en cada prenda.",
        imagen: "/images/overside.jpg"
    }
];

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            indiceActual: 0
        };

        this.intervalo = null;
    }

    // Iniciar el carrusel automáticamente
    componentDidMount() {
        this.intervalo = setInterval(() => {
            this.siguienteProducto();
        }, 5000);
    }

    // Limpiar el intervalo al salir de la vista
    componentWillUnmount() {
        clearInterval(this.intervalo);
    }

    // Pasar al siguiente producto
    siguienteProducto = () => {
        this.setState((prevState) => ({
            indiceActual:
                (prevState.indiceActual + 1) %
                productosDestacados.length
        }));
    };

    // Volver al producto anterior
    anteriorProducto = () => {
        this.setState((prevState) => ({
            indiceActual:
                (prevState.indiceActual - 1 +
                productosDestacados.length) %
                productosDestacados.length
        }));
    };

    // Seleccionar un producto específico
    seleccionarProducto = (indice) => {
        this.setState({
            indiceActual: indice
        });
    };

    render() {

        const producto =
            productosDestacados[this.state.indiceActual];

        return (

            <div className="menu-container">

                {/* CARRUSEL PRINCIPAL */}

                <section className="menu-carousel">

                    <img
                        key={producto.id}
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="carousel-image"
                    />

                    <div className="carousel-overlay">

                        <span className="carousel-subtitle">
                            RETRO PASSION COLLECTION
                        </span>

                        <h1>
                            {producto.nombre}
                        </h1>

                        <p>
                            {producto.descripcion}
                        </p>

                        <Link
                            to={`/producto/${producto.id}`}
                            className="carousel-button"
                        >
                            Descubrir producto
                        </Link>

                    </div>

                    {/* BOTÓN ANTERIOR */}

                    <button
                        className="carousel-arrow carousel-prev"
                        onClick={this.anteriorProducto}
                        aria-label="Producto anterior"
                    >
                        &#10094;
                    </button>

                    {/* BOTÓN SIGUIENTE */}

                    <button
                        className="carousel-arrow carousel-next"
                        onClick={this.siguienteProducto}
                        aria-label="Producto siguiente"
                    >
                        &#10095;
                    </button>

                    {/* INDICADORES */}

                    <div className="carousel-indicators">

                        {productosDestacados.map((item, index) => (

                            <button
                                key={item.id}
                                className={
                                    this.state.indiceActual === index
                                        ? "indicator active"
                                        : "indicator"
                                }
                                onClick={() =>
                                    this.seleccionarProducto(index)
                                }
                                aria-label={`Ver producto ${index + 1}`}
                            />

                        ))}

                    </div>

                </section>


                {/* DESCRIPCIÓN DE LA TIENDA */}

                <section className="menu-description">

                    <span className="description-subtitle">
                        NUESTRA IDENTIDAD
                    </span>

                    <h2>
                        Más que ropa, una identidad.
                    </h2>

                    <p>
                        En Retro Passion creemos que la ropa es una
                        forma de expresar quién sos. Por eso,
                        ofrecemos prendas con personalidad,
                        inspiradas en diferentes épocas y culturas
                        urbanas.
                    </p>

                    <p>
                        Nuestra selección se enfoca en chaquetas
                        de cuero, camperas con diseños únicos,
                        prendas holgadas y estilos oversize.
                        Combinamos la esencia retro con las
                        tendencias actuales para crear una
                        identidad auténtica.
                    </p>

                    <Link
                        to="/categorias"
                        className="description-button"
                    >
                        Explorar categorías
                    </Link>

                </section>

            </div>

        );
    }
}

export default Menu;
