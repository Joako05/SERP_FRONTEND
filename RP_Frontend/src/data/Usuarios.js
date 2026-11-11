
export const obtenerUsuarios = () => {
    try {
        const usuariosGuardados = localStorage.getItem("usuarios");

        if (usuariosGuardados !== null) {
            const usuariosParseados = JSON.parse(usuariosGuardados);

            if (Array.isArray(usuariosParseados)) {
                return usuariosParseados;
            }
        }

        return [];
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [];
    }
};

export const guardarUsuarios = (nuevosUsuarios) => {
    try {
        localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
        return true;
    } catch (error) {
        console.error("Error al guardar los usuarios:", error);
        return false;
    }
};

export const generarIdUsuario = (listaUsuarios) => {
    if (listaUsuarios.length === 0) {
        return 1;
    }

    const ids = listaUsuarios.map(usuario => Number(usuario.id));

    return Math.max(...ids) + 1;
};
