
import React, { Component } from "react";
import {
    obtenerProductos,
    guardarProductos,
    generarIdProducto
} from "../data/Productos";
import {
    obtenerUsuarios,
    guardarUsuarios
} from "../data/Usuarios";
import {
    obtenerPedidos,
    actualizarEstadoPedido,
    eliminarPedido
} from "../data/Pedidos";
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
        errorProducto: "",
        usuarios: [],
        busquedaUsuario: "",
        mostrarFormularioUsuario: false,
        usuarioEditandoId: null,
        nombreUsuario: "",
        apellidoUsuario: "",
        correoUsuario: "",
        telefonoUsuario: "",
        direccionUsuario: "",
        errorUsuario: "",
        pedidos: [],
    };
  }

componentDidMount() {
    this.setState({
        categorias: obtenerCategorias(),
        productos: obtenerProductos(),
        usuarios: obtenerUsuarios(),
        pedidos: obtenerPedidos()
    });
}
cambiarModulo = (modulo) => {

    this.setState({
        moduloActivo: modulo,
        mostrarFormularioCategoria: false,
        nombreCategoria: "",
        categoriaEditandoId: null,
        errorCategoria: "",

        // Actualizamos los pedidos al entrar en su módulo.
        pedidos: modulo === "pedidos"
            ? obtenerPedidos()
            : this.state.pedidos
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


abrirFormularioUsuario = (usuario) => {
    this.setState({
        mostrarFormularioUsuario: true,
        usuarioEditandoId: usuario.id,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        correoUsuario: usuario.correo,
        telefonoUsuario: usuario.telefono,
        direccionUsuario: usuario.direccion,
        errorUsuario: ""
    });
};

cerrarFormularioUsuario = () => {
    this.setState({
        mostrarFormularioUsuario: false,
        usuarioEditandoId: null,
        nombreUsuario: "",
        apellidoUsuario: "",
        correoUsuario: "",
        telefonoUsuario: "",
        direccionUsuario: "",
        errorUsuario: ""
    });
};

guardarUsuario = (event) => {
    event.preventDefault();

    const {
        nombreUsuario,
        apellidoUsuario,
        correoUsuario,
        telefonoUsuario,
        direccionUsuario,
        usuarioEditandoId,
        usuarios
    } = this.state;

    const nombre = nombreUsuario.trim();
    const apellido = apellidoUsuario.trim();
    const correo = correoUsuario.trim().toLowerCase();
    const telefono = telefonoUsuario.trim();
    const direccion = direccionUsuario.trim();

    if (!nombre || !apellido || !correo || !telefono || !direccion) {
        this.setState({
            errorUsuario: "Todos los campos son obligatorios."
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
        this.setState({
            errorUsuario: "Ingresá un correo electrónico válido."
        });
        return;
    }

    const telefonoRegex = /^[0-9+\s()-]{8,20}$/;

    if (!telefonoRegex.test(telefono)) {
        this.setState({
            errorUsuario: "Ingresá un número de teléfono válido."
        });
        return;
    }

    const correoDuplicado = usuarios.some(
        usuario =>
            usuario.correo.toLowerCase() === correo &&
            usuario.id !== usuarioEditandoId
    );

    if (correoDuplicado) {
        this.setState({
            errorUsuario: "Ya existe otro usuario con ese correo electrónico."
        });
        return;
    }

    const nuevosUsuarios = usuarios.map(usuario =>
        usuario.id === usuarioEditandoId
            ? {
                ...usuario,
                nombre,
                apellido,
                correo,
                telefono,
                direccion
            }
            : usuario
    );

    const guardado = guardarUsuarios(nuevosUsuarios);

    if (!guardado) {
        this.setState({
            errorUsuario: "No se pudieron guardar los cambios."
        });
        return;
    }

    this.setState({
        usuarios: nuevosUsuarios,
        mostrarFormularioUsuario: false,
        usuarioEditandoId: null,
        nombreUsuario: "",
        apellidoUsuario: "",
        correoUsuario: "",
        telefonoUsuario: "",
        direccionUsuario: "",
        errorUsuario: ""
    });
};

eliminarUsuario = (id) => {
    const confirmar = window.confirm(
        "¿Estás seguro de que querés eliminar este usuario?"
    );

    if (!confirmar) return;

    const nuevosUsuarios = this.state.usuarios.filter(
        usuario => usuario.id !== id
    );

    const guardado = guardarUsuarios(nuevosUsuarios);

    if (!guardado) {
        window.alert("No se pudo eliminar el usuario.");
        return;
    }

    this.setState({
        usuarios: nuevosUsuarios
    });

    if (this.state.usuarioEditandoId === id) {
        this.cerrarFormularioUsuario();
    }
};




renderUsuarios() {
    const {
        usuarios,
        busquedaUsuario,
        mostrarFormularioUsuario,
        nombreUsuario,
        apellidoUsuario,
        correoUsuario,
        telefonoUsuario,
        direccionUsuario,
        errorUsuario
    } = this.state;

    const usuariosFiltrados = usuarios.filter(usuario => {
        const busqueda = busquedaUsuario.toLowerCase().trim();

        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();

        return (
            nombreCompleto.includes(busqueda) ||
            usuario.correo.toLowerCase().includes(busqueda) ||
            usuario.telefono.includes(busqueda)
        );
    });

    return (
        <div className="admin-module-content">

            <div className="admin-module-header">
                <div>
                    <h2>Usuarios</h2>
                    <p>Administrá los usuarios registrados en Retro Passion.</p>
                </div>
            </div>

            {mostrarFormularioUsuario && (
                <form
                    className="admin-user-form"
                    onSubmit={this.guardarUsuario}
                >
                    <h3>Editar usuario</h3>

                    <div className="admin-user-form-row">
                        <div>
                            <label htmlFor="nombreUsuario">Nombre</label>
                            <input
                                id="nombreUsuario"
                                type="text"
                                value={nombreUsuario}
                                onChange={event => this.setState({
                                    nombreUsuario: event.target.value,
                                    errorUsuario: ""
                                })}
                                maxLength="60"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="apellidoUsuario">Apellido</label>
                            <input
                                id="apellidoUsuario"
                                type="text"
                                value={apellidoUsuario}
                                onChange={event => this.setState({
                                    apellidoUsuario: event.target.value,
                                    errorUsuario: ""
                                })}
                                maxLength="60"
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="correoUsuario">Correo electrónico</label>
                    <input
                        id="correoUsuario"
                        type="email"
                        value={correoUsuario}
                        onChange={event => this.setState({
                            correoUsuario: event.target.value,
                            errorUsuario: ""
                        })}
                        required
                    />

                    <label htmlFor="telefonoUsuario">Teléfono</label>
                    <input
                        id="telefonoUsuario"
                        type="tel"
                        value={telefonoUsuario}
                        onChange={event => this.setState({
                            telefonoUsuario: event.target.value,
                            errorUsuario: ""
                        })}
                        required
                    />

                    <label htmlFor="direccionUsuario">Dirección</label>
                    <input
                        id="direccionUsuario"
                        type="text"
                        value={direccionUsuario}
                        onChange={event => this.setState({
                            direccionUsuario: event.target.value,
                            errorUsuario: ""
                        })}
                        required
                    />

                    {errorUsuario && (
                        <p className="admin-category-error">
                            {errorUsuario}
                        </p>
                    )}

                    <div className="admin-form-actions">
                        <button
                            type="submit"
                            className="admin-save-button"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            className="admin-cancel-button"
                            onClick={this.cerrarFormularioUsuario}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="admin-user-list">

                <div className="admin-list-title">
                    <h3>Listado de usuarios</h3>
                    <span>{usuarios.length} usuarios</span>
                </div>

                <div className="admin-user-search">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o teléfono..."
                        value={busquedaUsuario}
                        onChange={event => this.setState({
                            busquedaUsuario: event.target.value
                        })}
                    />
                </div>

                {usuariosFiltrados.length > 0 ? (

                    <div className="admin-user-table">

                        <div className="admin-user-row admin-user-heading">
                            <span>Usuario</span>
                            <span>Correo</span>
                            <span>Teléfono</span>
                            <span>Dirección</span>
                            <span>Acciones</span>
                        </div>

                        {usuariosFiltrados.map(usuario => (
                            <div
                                className="admin-user-row"
                                key={usuario.id}
                            >
                                <div className="admin-user-name">
                                    <strong>
                                        {usuario.nombre} {usuario.apellido}
                                    </strong>
                                    <small>ID: {usuario.id}</small>
                                </div>

                                <span>{usuario.correo}</span>

                                <span>{usuario.telefono}</span>

                                <span>{usuario.direccion}</span>

                                <div className="admin-category-actions">
                                    <button
                                        className="admin-edit-button"
                                        onClick={() => this.abrirFormularioUsuario(usuario)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="admin-delete-button"
                                        onClick={() => this.eliminarUsuario(usuario.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                ) : (
                    <div className="admin-empty-state">
                        <h3>
                            {usuarios.length === 0
                                ? "No hay usuarios registrados"
                                : "No se encontraron usuarios"}
                        </h3>

                        <p>
                            {usuarios.length === 0
                                ? "Los usuarios que creen una cuenta aparecerán en este listado."
                                : "Probá con otro nombre, correo o teléfono."}
                        </p>
                    </div>
                )}

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

cambiarEstadoPedido = (id, nuevoEstado) => {

    const actualizado = actualizarEstadoPedido(
        id,
        nuevoEstado
    );

    if (!actualizado) {
        window.alert(
            "No se pudo actualizar el estado del pedido."
        );
        return;
    }

    this.setState({
        pedidos: obtenerPedidos()
    });
};
eliminarPedidoAdmin = (id) => {
    const pedido = this.state.pedidos.find(
        pedido => Number(pedido.id) === Number(id)
    );

    if (!pedido || pedido.estado !== "Cancelado") {
        window.alert(
            "Solo se pueden eliminar pedidos que estén cancelados."
        );
        return;
    }

    const confirmar = window.confirm(
        `¿Estás seguro de que querés eliminar el pedido #${id}? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    const eliminado = eliminarPedido(id);

    if (!eliminado) {
        window.alert("No se pudo eliminar el pedido.");
        return;
    }

    this.setState({
        pedidos: obtenerPedidos()
    });
};


renderPedidos() {

    const { pedidos } = this.state;

    const pedidosOrdenados = [...pedidos].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    const formatearPrecio = (precio) => {
        return Number(precio || 0).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 2
        });
    };

    const formatearFecha = (fecha) => {
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

    return (
        <div className="admin-module-content">

            <div className="admin-module-header">
                <div>
                    <h2>Pedidos</h2>
                    <p>
                        Consultá y gestioná los pedidos de los clientes.
                    </p>
                </div>
            </div>

            <div className="admin-order-list">

                <div className="admin-list-title">
                    <h3>Listado de pedidos</h3>
                    <span>{pedidos.length} pedidos</span>
                </div>

                {pedidosOrdenados.length > 0 ? (

                    <div className="admin-orders">

                        {pedidosOrdenados.map(pedido => (

                            <article
                                className="admin-order-card"
                                key={pedido.id}
                            >

                                <div className="admin-order-header">

                                    <div>
                                        <h3>
                                            Pedido #{pedido.id}
                                        </h3>

                                        <p>
                                            {formatearFecha(pedido.fecha)}
                                        </p>
                                    </div>

                                    <span className="admin-order-status">
                                        {pedido.estado || "Pendiente"}
                                    </span>

                                </div>

                                <div className="admin-order-client">

                                    <h4>Datos del cliente</h4>

                                    <p>
                                        <strong>Nombre:</strong>{" "}
                                        {pedido.cliente?.nombre || "No disponible"}{" "}
                                        {pedido.cliente?.apellido || ""}
                                    </p>

                                    <p>
                                        <strong>Correo:</strong>{" "}
                                        {pedido.cliente?.correo || "No disponible"}
                                    </p>

                                    <p>
                                        <strong>ID de usuario:</strong>{" "}
                                        {pedido.usuarioId}
                                    </p>

                                    <p>
                                        <strong>Dirección de entrega:</strong>{" "}
                                        {pedido.direccion}
                                    </p>

                                    <p>
                                        <strong>Método de pago:</strong>{" "}
                                        {pedido.metodoPago}
                                    </p>

                                </div>

                                <div className="admin-order-products">

                                    <h4>Productos comprados</h4>

                                    {pedido.productos.map((producto, index) => (

                                        <div
                                            className="admin-order-product"
                                            key={`${pedido.id}-${producto.id}-${index}`}
                                        >

                                            <div>
                                                <strong>
                                                    {producto.nombre}
                                                </strong>

                                                <p>
                                                    Cantidad: {producto.cantidad}
                                                </p>
                                            </div>

                                            <span>
                                                {formatearPrecio(
                                                    Number(producto.precio) *
                                                    Number(producto.cantidad)
                                                )}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                <div className="admin-order-footer">

                                    <div className="admin-order-total">
                                        <span>Total del pedido</span>

                                        <strong>
                                            {formatearPrecio(pedido.total)}
                                        </strong>
                                    </div>

                                <div className="admin-order-management">

                                    <label htmlFor={`estado-pedido-${pedido.id}`}>
                                        Estado del pedido
                                    </label>

                                    <select
                                        id={`estado-pedido-${pedido.id}`}
                                        value={pedido.estado || "Pendiente"}
                                        onChange={event =>
                                            this.cambiarEstadoPedido(
                                                pedido.id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En preparación">En preparación</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>

                                    {pedido.estado === "Cancelado" && (
                                        <button
                                            type="button"
                                            className="admin-delete-button"
                                            onClick={() => this.eliminarPedidoAdmin(pedido.id)}
                                        >
                                            Eliminar pedido
                                        </button>
                                    )}

                                </div>

                                </div>

                            </article>

                        ))}

                    </div>

                ) : (

                    <div className="admin-empty-state">
                        <h3>No hay pedidos registrados</h3>

                        <p>
                            Cuando los clientes realicen compras,
                            aparecerán en este apartado.
                        </p>
                    </div>

                )}

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
