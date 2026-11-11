
import React, { Component } from "react";
import {
    obtenerProductos,
    guardarProductos,
    generarIdProducto
} from "../data/Productos";
import "./PanelAdmin.css";

import {
  obtenerCategorias,
  guardarCategorias
} from "../data/Categorias";

class PanelAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
        
      moduloActivo: "usuarios",
      categorias: [],
      mostrarFormularioCategoria: false,
      nombreCategoria: "",
      categoriaEditandoId: null,
      errorCategoria: "",
      productos: [],
    mostrarFormularioProducto: false,
    productoEditandoId: null,
    nombreProducto: "",
    categoriaProducto: "",
    descripcionProducto: "",
    precioProducto: "",
    stockProducto: "",
    imagenProducto: "",
    errorProducto: ""
    };
  }

componentDidMount() {
    this.setState({
        categorias: obtenerCategorias(),
        productos: obtenerProductos()
    });
}

  cambiarModulo = (modulo) => {
    this.setState({
      moduloActivo: modulo,
      mostrarFormularioCategoria: false,
      nombreCategoria: "",
      categoriaEditandoId: null,
      errorCategoria: ""
    });
  };

  abrirFormularioCategoria = () => {
    this.setState({
      mostrarFormularioCategoria: true,
      nombreCategoria: "",
      categoriaEditandoId: null,
      errorCategoria: ""
    });
  };

  editarCategoria = (categoria) => {
    this.setState({
      mostrarFormularioCategoria: true,
      nombreCategoria: categoria.nombre,
      categoriaEditandoId: categoria.id,
      errorCategoria: ""
    });
  };

  cerrarFormularioCategoria = () => {
    this.setState({
      mostrarFormularioCategoria: false,
      nombreCategoria: "",
      categoriaEditandoId: null,
      errorCategoria: ""
    });
  };

  generarIdCategoria = (nombre) => {
    const baseId = nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let nuevoId = baseId || "categoria";
    let contador = 1;

    while (
      this.state.categorias.some(
        (categoria) => categoria.id === nuevoId
      )
    ) {
      nuevoId = `${baseId || "categoria"}-${contador}`;
      contador++;
    }

    return nuevoId;
  };

  guardarCategoria = (event) => {
    event.preventDefault();

    const nombre = this.state.nombreCategoria.trim();

    if (!nombre) {
      this.setState({
        errorCategoria: "Ingresá un nombre para la categoría."
      });
      return;
    }

    const nombreDuplicado = this.state.categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase() === nombre.toLowerCase() &&
        categoria.id !== this.state.categoriaEditandoId
    );

    if (nombreDuplicado) {
      this.setState({
        errorCategoria: "Ya existe una categoría con ese nombre."
      });
      return;
    }

    let nuevasCategorias;

    if (this.state.categoriaEditandoId) {
      nuevasCategorias = this.state.categorias.map((categoria) =>
        categoria.id === this.state.categoriaEditandoId
          ? { ...categoria, nombre }
          : categoria
      );
    } else {
        const nuevaCategoria = {
            id: this.generarIdCategoria(nombre),
            nombre,
            descripcion: ""
        };

      nuevasCategorias = [
        ...this.state.categorias,
        nuevaCategoria
      ];
    }

    const guardado = guardarCategorias(nuevasCategorias);

    if (!guardado) {
      this.setState({
        errorCategoria: "No se pudieron guardar los cambios."
      });
      return;
    }

    this.setState({
      categorias: nuevasCategorias,
      mostrarFormularioCategoria: false,
      nombreCategoria: "",
      categoriaEditandoId: null,
      errorCategoria: ""
    });
  };

eliminarCategoria = (id) => {
    const productosActuales = obtenerProductos();

    const tieneProductos = productosActuales.some(
        producto => producto.categoria === id
    );

    if (tieneProductos) {
        window.alert(
            "No se puede eliminar esta categoría porque tiene productos asociados. Primero reasigná o eliminá esos productos."
        );
        return;
    }

    const confirmar = window.confirm(
        "¿Estás seguro de que querés eliminar esta categoría?"
    );

    if (!confirmar) return;

    const nuevasCategorias = this.state.categorias.filter(
        categoria => categoria.id !== id
    );

    const guardado = guardarCategorias(nuevasCategorias);

    if (!guardado) {
        window.alert("No se pudo eliminar la categoría.");
        return;
    }

    this.setState({
        categorias: nuevasCategorias
    });
};


abrirFormularioProducto = () => {
    const primeraCategoria = this.state.categorias[0];

    if (!primeraCategoria) {
        window.alert("Primero necesitás crear una categoría.");
        return;
    }

    this.setState({
        mostrarFormularioProducto: true,
        productoEditandoId: null,
        nombreProducto: "",
        categoriaProducto: primeraCategoria.id,
        descripcionProducto: "",
        precioProducto: "",
        stockProducto: "",
        imagenProducto: "",
        errorProducto: ""
    });
};

editarProducto = (producto) => {
    this.setState({
        mostrarFormularioProducto: true,
        productoEditandoId: producto.id,
        nombreProducto: producto.nombre,
        categoriaProducto: producto.categoria,
        descripcionProducto: producto.descripcion || "",
        precioProducto: String(producto.precio),
        stockProducto: String(producto.stock),
        imagenProducto: producto.imagen || "",
        errorProducto: ""
    });
};

cerrarFormularioProducto = () => {
    this.setState({
        mostrarFormularioProducto: false,
        productoEditandoId: null,
        nombreProducto: "",
        categoriaProducto: "",
        descripcionProducto: "",
        precioProducto: "",
        stockProducto: "",
        imagenProducto: "",
        errorProducto: ""
    });
};

guardarProducto = (event) => {
    event.preventDefault();

    const {
        nombreProducto,
        categoriaProducto,
        descripcionProducto,
        precioProducto,
        stockProducto,
        imagenProducto,
        productoEditandoId,
        productos,
        categorias
    } = this.state;

    const nombre = nombreProducto.trim();
    const descripcion = descripcionProducto.trim();
    const imagen = imagenProducto.trim();
    const precio = Number(precioProducto);
    const stock = Number(stockProducto);

    if (!nombre || !categoriaProducto || !descripcion || !imagen) {
        this.setState({
            errorProducto: "Completá todos los campos."
        });
        return;
    }

    if (!categorias.some(categoria => categoria.id === categoriaProducto)) {
        this.setState({
            errorProducto: "Seleccioná una categoría válida."
        });
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        this.setState({
            errorProducto: "El precio debe ser un número mayor a cero."
        });
        return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
        this.setState({
            errorProducto: "El stock debe ser un número entero igual o mayor a cero."
        });
        return;
    }

    const nombreDuplicado = productos.some(
        producto =>
            producto.nombre.toLowerCase() === nombre.toLowerCase() &&
            producto.id !== productoEditandoId
    );

    if (nombreDuplicado) {
        this.setState({
            errorProducto: "Ya existe un producto con ese nombre."
        });
        return;
    }

    let nuevosProductos;

    if (productoEditandoId !== null) {
        nuevosProductos = productos.map(producto =>
            producto.id === productoEditandoId
                ? {
                    ...producto,
                    nombre,
                    categoria: categoriaProducto,
                    descripcion,
                    precio,
                    stock,
                    imagen
                }
                : producto
        );
    } else {
        const nuevoProducto = {
            id: generarIdProducto(productos),
            nombre,
            categoria: categoriaProducto,
            descripcion,
            precio,
            stock,
            imagen
        };

        nuevosProductos = [...productos, nuevoProducto];
    }

    const guardado = guardarProductos(nuevosProductos);

    if (!guardado) {
        this.setState({
            errorProducto: "No se pudieron guardar los cambios."
        });
        return;
    }

    this.setState({
        productos: nuevosProductos,
        mostrarFormularioProducto: false,
        productoEditandoId: null,
        nombreProducto: "",
        categoriaProducto: "",
        descripcionProducto: "",
        precioProducto: "",
        stockProducto: "",
        imagenProducto: "",
        errorProducto: ""
    });
};

eliminarProducto = (id) => {
    const confirmar = window.confirm(
        "¿Estás seguro de que querés eliminar este producto?"
    );

    if (!confirmar) return;

    const productosActuales = obtenerProductos();

    const nuevosProductos = productosActuales.filter(
        producto => producto.id !== id
    );

    const guardado = guardarProductos(nuevosProductos);

    if (!guardado) {
        window.alert("No se pudo eliminar el producto.");
        return;
    }

    this.setState({
        productos: nuevosProductos
    });
};

  renderUsuarios() {
    return (
      <div className="admin-module-content">
        <div className="admin-module-header">
          <div>
            <h2>Usuarios</h2>
            <p>Administrá los usuarios registrados en Retro Passion.</p>
          </div>
        </div>

        <div className="admin-empty-state">
          <h3>Listado de usuarios</h3>
          <p>
            Aquí aparecerán los usuarios registrados en la tienda.
          </p>
        </div>
      </div>
    );
  }

  renderCategorias() {
    const {
      categorias,
      mostrarFormularioCategoria,
      nombreCategoria,
      categoriaEditandoId,
      errorCategoria
    } = this.state;

    return (
      <div className="admin-module-content">
        <div className="admin-module-header">
          <div>
            <h2>Categorías</h2>
            <p>Administrá las categorías de productos.</p>
          </div>

          <button
            className="admin-add-button"
            onClick={this.abrirFormularioCategoria}
          >
            + Nueva categoría
          </button>
        </div>

        {mostrarFormularioCategoria && (
          <form
            className="admin-category-form"
            onSubmit={this.guardarCategoria}
          >
            <h3>
              {categoriaEditandoId
                ? "Editar categoría"
                : "Nueva categoría"}
            </h3>

            <label htmlFor="nombreCategoria">
              Nombre de la categoría
            </label>

            <input
              id="nombreCategoria"
              type="text"
              value={nombreCategoria}
              onChange={(event) =>
                this.setState({
                  nombreCategoria: event.target.value,
                  errorCategoria: ""
                })
              }
              placeholder="Ejemplo: Accesorios"
              maxLength="50"
              required
            />

            {errorCategoria && (
              <p className="admin-category-error">
                {errorCategoria}
              </p>
            )}

            <div className="admin-form-actions">
              <button type="submit" className="admin-save-button">
                {categoriaEditandoId ? "Guardar cambios" : "Crear categoría"}
              </button>

              <button
                type="button"
                className="admin-cancel-button"
                onClick={this.cerrarFormularioCategoria}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="admin-category-list">
          <div className="admin-list-title">
            <h3>Listado de categorías</h3>
            <span>{categorias.length} categorías</span>
          </div>

          {categorias.length > 0 ? (
            <div className="admin-category-table">
              <div className="admin-category-row admin-category-heading">
                <span>Nombre</span>
                <span>Identificador</span>
                <span>Acciones</span>
              </div>

              {categorias.map((categoria) => (
                <div
                  className="admin-category-row"
                  key={categoria.id}
                >
                  <span className="admin-category-name">
                    {categoria.nombre}
                  </span>

                  <span className="admin-category-id">
                    {categoria.id}
                  </span>

                  <div className="admin-category-actions">
                    <button
                      className="admin-edit-button"
                      onClick={() => this.editarCategoria(categoria)}
                    >
                      Editar
                    </button>

                    <button
                      className="admin-delete-button"
                      onClick={() => this.eliminarCategoria(categoria.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <h3>No hay categorías</h3>
              <p>Podés crear una nueva categoría con el botón superior.</p>
            </div>
          )}
        </div>
      </div>
    );
  }


renderProductos() {
    const {
        productos,
        categorias,
        mostrarFormularioProducto,
        productoEditandoId,
        nombreProducto,
        categoriaProducto,
        descripcionProducto,
        precioProducto,
        stockProducto,
        imagenProducto,
        errorProducto
    } = this.state;

    return (
        <div className="admin-module-content">

            <div className="admin-module-header">
                <div>
                    <h2>Productos</h2>
                    <p>Administrá el catálogo de Retro Passion.</p>
                </div>

                <button
                    className="admin-add-button"
                    onClick={this.abrirFormularioProducto}
                >
                    + Nuevo producto
                </button>
            </div>

            {mostrarFormularioProducto && (
                <form
                    className="admin-product-form"
                    onSubmit={this.guardarProducto}
                >
                    <h3>
                        {productoEditandoId !== null
                            ? "Editar producto"
                            : "Nuevo producto"}
                    </h3>

                    <label htmlFor="nombreProducto">
                        Nombre del producto
                    </label>

                    <input
                        id="nombreProducto"
                        type="text"
                        value={nombreProducto}
                        onChange={event => this.setState({
                            nombreProducto: event.target.value,
                            errorProducto: ""
                        })}
                        placeholder="Ejemplo: Remera Retro"
                        maxLength="80"
                        required
                    />

                    <label htmlFor="categoriaProducto">
                        Categoría
                    </label>

                    <select
                        id="categoriaProducto"
                        value={categoriaProducto}
                        onChange={event => this.setState({
                            categoriaProducto: event.target.value,
                            errorProducto: ""
                        })}
                        required
                    >
                        {categorias.map(categoria => (
                            <option
                                key={categoria.id}
                                value={categoria.id}
                            >
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="descripcionProducto">
                        Descripción
                    </label>

                    <textarea
                        id="descripcionProducto"
                        value={descripcionProducto}
                        onChange={event => this.setState({
                            descripcionProducto: event.target.value,
                            errorProducto: ""
                        })}
                        placeholder="Describí las características del producto..."
                        rows="4"
                        maxLength="500"
                        required
                    />

                    <div className="admin-product-form-row">

                        <div>
                            <label htmlFor="precioProducto">
                                Precio ($)
                            </label>

                            <input
                                id="precioProducto"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={precioProducto}
                                onChange={event => this.setState({
                                    precioProducto: event.target.value,
                                    errorProducto: ""
                                })}
                                placeholder="25000"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="stockProducto">
                                Stock disponible
                            </label>

                            <input
                                id="stockProducto"
                                type="number"
                                min="0"
                                step="1"
                                value={stockProducto}
                                onChange={event => this.setState({
                                    stockProducto: event.target.value,
                                    errorProducto: ""
                                })}
                                placeholder="15"
                                required
                            />
                        </div>

                    </div>

                    <label htmlFor="imagenProducto">
                        Ruta de la imagen
                    </label>

                    <input
                        id="imagenProducto"
                        type="text"
                        value={imagenProducto}
                        onChange={event => this.setState({
                            imagenProducto: event.target.value,
                            errorProducto: ""
                        })}
                        placeholder="/images/remera.jpg"
                        required
                    />

                    <p className="admin-product-image-help">
                        Ejemplo: /images/remera.jpg. La imagen debe
                        encontrarse dentro de la carpeta pública de tu proyecto.
                    </p>

                    {errorProducto && (
                        <p className="admin-category-error">
                            {errorProducto}
                        </p>
                    )}

                    <div className="admin-form-actions">
                        <button
                            type="submit"
                            className="admin-save-button"
                        >
                            {productoEditandoId !== null
                                ? "Guardar cambios"
                                : "Crear producto"}
                        </button>

                        <button
                            type="button"
                            className="admin-cancel-button"
                            onClick={this.cerrarFormularioProducto}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="admin-product-list">

                <div className="admin-list-title">
                    <h3>Listado de productos</h3>
                    <span>{productos.length} productos</span>
                </div>

                {productos.length > 0 ? (
                    <div className="admin-product-table">

                        <div className="admin-product-row admin-product-heading">
                            <span>Producto</span>
                            <span>Categoría</span>
                            <span>Precio</span>
                            <span>Stock</span>
                            <span>Acciones</span>
                        </div>

                        {productos.map(producto => {
                            const categoria = categorias.find(
                                item => item.id === producto.categoria
                            );

                            return (
                                <div
                                    className="admin-product-row"
                                    key={producto.id}
                                >
                                    <div className="admin-product-name">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                        />

                                        <span>{producto.nombre}</span>
                                    </div>

                                    <span>
                                        {categoria
                                            ? categoria.nombre
                                            : "Sin categoría"}
                                    </span>

                                    <span>
                                        ${producto.precio.toLocaleString("es-AR")}
                                    </span>

                                    <span className={
                                        producto.stock === 0
                                            ? "admin-product-no-stock"
                                            : ""
                                    }>
                                        {producto.stock}
                                    </span>

                                    <div className="admin-category-actions">
                                        <button
                                            className="admin-edit-button"
                                            onClick={() => this.editarProducto(producto)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="admin-delete-button"
                                            onClick={() => this.eliminarProducto(producto.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                ) : (
                    <div className="admin-empty-state">
                        <h3>No hay productos registrados</h3>
                        <p>
                            Podés agregar un producto utilizando el botón superior.
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}


  renderPedidos() {
    return (
      <div className="admin-module-content">
        <div className="admin-module-header">
          <div>
            <h2>Pedidos</h2>
            <p>Consultá y gestioná los pedidos de los clientes.</p>
          </div>
        </div>

        <div className="admin-empty-state">
          <h3>Pedidos recientes</h3>
          <p>
            Aquí aparecerán los pedidos realizados por los clientes.
          </p>
        </div>
      </div>
    );
  }

  renderContenido() {
    switch (this.state.moduloActivo) {
      case "usuarios":
        return this.renderUsuarios();

      case "categorias":
        return this.renderCategorias();

      case "productos":
        return this.renderProductos();

      case "pedidos":
        return this.renderPedidos();

      default:
        return null;
    }
  }

  render() {
    const { moduloActivo } = this.state;

    return (
      <section className="admin-container">

        <div className="admin-navigation">
          <button
            className={moduloActivo === "usuarios" ? "active" : ""}
            onClick={() => this.cambiarModulo("usuarios")}
          >
            Usuarios
          </button>

          <button
            className={moduloActivo === "categorias" ? "active" : ""}
            onClick={() => this.cambiarModulo("categorias")}
          >
            Categorías
          </button>

          <button
            className={moduloActivo === "productos" ? "active" : ""}
            onClick={() => this.cambiarModulo("productos")}
          >
            Productos
          </button>

          <button
            className={moduloActivo === "pedidos" ? "active" : ""}
            onClick={() => this.cambiarModulo("pedidos")}
          >
            Pedidos
          </button>
        </div>

        <div className="admin-welcome">
          <h1>Bienvenido Administrador</h1>
          <p>
            Aquí puedes ver el panel de administración de cada módulo.
          </p>
        </div>

        <div className="admin-content">
          {this.renderContenido()}
        </div>

      </section>
    );
  }
}

export default PanelAdmin;
