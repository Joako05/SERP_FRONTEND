
// Recupera todos los pedidos almacenados.
export const obtenerPedidos = () => {
    try {
        const pedidosGuardados = localStorage.getItem("pedidos");

        if (pedidosGuardados !== null) {
            const pedidosParseados = JSON.parse(pedidosGuardados);

            if (Array.isArray(pedidosParseados)) {
                return pedidosParseados;
            }
        }

        return [];
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return [];
    }
};

// Guarda la lista completa de pedidos.
export const guardarPedidos = (nuevosPedidos) => {
    try {
        if (!Array.isArray(nuevosPedidos)) {
            return false;
        }

        localStorage.setItem("pedidos", JSON.stringify(nuevosPedidos));
        return true;
    } catch (error) {
        console.error("Error al guardar los pedidos:", error);
        return false;
    }
};

// Genera un ID numérico para el próximo pedido.
export const generarIdPedido = (listaPedidos) => {
    if (!Array.isArray(listaPedidos) || listaPedidos.length === 0) {
        return 1;
    }

    const ids = listaPedidos.map(pedido => Number(pedido.id));

    return Math.max(0, ...ids) + 1;
};

// Busca un pedido por su identificador.
export const obtenerPedidoPorId = (id) => {
    const pedidos = obtenerPedidos();

    return pedidos.find(pedido => Number(pedido.id) === Number(id)) || null;
};

// Actualiza el estado de un pedido.
export const actualizarEstadoPedido = (id, nuevoEstado) => {
    const estadosPermitidos = [
        "Pendiente",
        "En preparación",
        "Enviado",
        "Entregado",
        "Cancelado"
    ];

    if (!estadosPermitidos.includes(nuevoEstado)) {
        return false;
    }

    const pedidos = obtenerPedidos();

    const indice = pedidos.findIndex(
        pedido => Number(pedido.id) === Number(id)
    );

    if (indice === -1) {
        return false;
    }

    const pedidosActualizados = [...pedidos];

    pedidosActualizados[indice] = {
        ...pedidosActualizados[indice],
        estado: nuevoEstado
    };

    return guardarPedidos(pedidosActualizados);
};
// Elimina un pedido únicamente si está cancelado.
export const eliminarPedido = (id) => {
    const pedidos = obtenerPedidos();

    const pedido = pedidos.find(
        pedido => Number(pedido.id) === Number(id)
    );

    if (!pedido || pedido.estado !== "Cancelado") {
        return false;
    }

    const pedidosActualizados = pedidos.filter(
        pedido => Number(pedido.id) !== Number(id)
    );

    return guardarPedidos(pedidosActualizados);
};