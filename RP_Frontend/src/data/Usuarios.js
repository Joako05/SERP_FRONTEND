const ITERACIONES_PBKDF2 = 310000;
const ITERACIONES_MINIMAS = 100000;
const ITERACIONES_MAXIMAS = 1000000;

const LONGITUD_SAL = 16;
const LONGITUD_HASH = 256;
const LONGITUD_HASH_BYTES = LONGITUD_HASH / 8;

const CLAVE_USUARIOS = "usuarios";
const CLAVE_SESION = "usuarioActivo";
const EVENTO_SESION = "sesionActualizada";

// Comprueba que el navegador permita utilizar criptografía.
const obtenerCrypto = () => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            "Tu navegador no permite utilizar las funciones criptográficas necesarias."
        );
    }

    return window.crypto;
};

// Notifica a los componentes que hubo un cambio en la sesión.
const notificarCambioSesion = () => {
    window.dispatchEvent(new Event(EVENTO_SESION));
};

// Convierte bytes a Base64.
const convertirABase64 = (bytes) => {
    let texto = "";

    bytes.forEach(byte => {
        texto += String.fromCharCode(byte);
    });

    return window.btoa(texto);
};

// Convierte Base64 a bytes.
const convertirDesdeBase64 = (texto) => {
    const binario = window.atob(texto);

    return Uint8Array.from(
        binario,
        caracter => caracter.charCodeAt(0)
    );
};

// Genera el hash de una contraseña mediante PBKDF2.
const generarHash = async (password, salt, iteraciones) => {
    const cryptoAPI = obtenerCrypto();
    const encoder = new TextEncoder();

    const clave = await cryptoAPI.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const resultado = await cryptoAPI.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: iteraciones,
            hash: "SHA-256"
        },
        clave,
        LONGITUD_HASH
    );

    return new Uint8Array(resultado);
};

// Recupera los usuarios registrados.
export const obtenerUsuarios = () => {
    try {
        const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

        if (usuariosGuardados === null) {
            return [];
        }

        const usuariosParseados = JSON.parse(usuariosGuardados);

        return Array.isArray(usuariosParseados)
            ? usuariosParseados
            : [];

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [];
    }
};

// Guarda la lista de usuarios y sincroniza la sesión.
export const guardarUsuarios = (nuevosUsuarios) => {
    try {
        if (!Array.isArray(nuevosUsuarios)) {
            return false;
        }

        localStorage.setItem(
            CLAVE_USUARIOS,
            JSON.stringify(nuevosUsuarios)
        );

        // Si el usuario de la sesión fue eliminado,
        // cerramos automáticamente esa sesión.
        const sesionGuardada = localStorage.getItem(CLAVE_SESION);

        if (sesionGuardada) {
            const sesion = JSON.parse(sesionGuardada);

            const usuarioExiste = nuevosUsuarios.some(
                usuario => Number(usuario.id) === Number(sesion.id)
            );

            if (!usuarioExiste) {
                localStorage.removeItem(CLAVE_SESION);
            }
        }

        notificarCambioSesion();

        return true;

    } catch (error) {
        console.error("Error al guardar los usuarios:", error);
        return false;
    }
};

// Genera un ID numérico para el próximo usuario.
export const generarIdUsuario = (listaUsuarios) => {
    if (!listaUsuarios.length) {
        return 1;
    }

    const ids = listaUsuarios.map(usuario => Number(usuario.id));

    return Math.max(...ids) + 1;
};

// Genera una sal aleatoria y un hash de contraseña.
export const crearCredenciales = async (password) => {
    if (typeof password !== "string" || password.length === 0) {
        throw new Error("La contraseña no es válida.");
    }

    const cryptoAPI = obtenerCrypto();

    const salt = cryptoAPI.getRandomValues(
        new Uint8Array(LONGITUD_SAL)
    );

    const hash = await generarHash(
        password,
        salt,
        ITERACIONES_PBKDF2
    );

    return {
        passwordSalt: convertirABase64(salt),
        passwordHash: convertirABase64(hash),
        passwordIteraciones: ITERACIONES_PBKDF2
    };
};

// Comprueba si la contraseña coincide con la registrada.
export const verificarCredenciales = async (password, usuario) => {
    try {
        if (
            typeof password !== "string" ||
            !usuario ||
            typeof usuario.passwordSalt !== "string" ||
            typeof usuario.passwordHash !== "string" ||
            !Number.isInteger(usuario.passwordIteraciones) ||
            usuario.passwordIteraciones < ITERACIONES_MINIMAS ||
            usuario.passwordIteraciones > ITERACIONES_MAXIMAS
        ) {
            return false;
        }

        const salt = convertirDesdeBase64(usuario.passwordSalt);
        const hashGuardado = convertirDesdeBase64(usuario.passwordHash);

        if (
            salt.length !== LONGITUD_SAL ||
            hashGuardado.length !== LONGITUD_HASH_BYTES
        ) {
            return false;
        }

        const hashCalculado = await generarHash(
            password,
            salt,
            usuario.passwordIteraciones
        );

        // Compara todos los bytes sin detenerse
        // en la primera diferencia.
        let diferencia = 0;

        for (let i = 0; i < hashCalculado.length; i++) {
            diferencia |= hashCalculado[i] ^ hashGuardado[i];
        }

        return diferencia === 0;

    } catch (error) {
        console.error("Error al verificar las credenciales:", error);
        return false;
    }
};

// Devuelve únicamente los datos públicos del usuario.
const obtenerDatosPublicos = (usuario) => {
    if (!usuario) {
        return null;
    }

    return {
        id: usuario.id,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        rol: usuario.rol === "admin" ? "admin" : "cliente"
    };
};

// Guarda la sesión del usuario.
export const guardarSesion = (usuario) => {
    try {
        if (!usuario || usuario.id === undefined || usuario.id === null) {
            return false;
        }

        // Comprobamos que el usuario exista en el registro.
        const usuarioRegistrado = obtenerUsuarios().find(
            item => Number(item.id) === Number(usuario.id)
        );

        if (!usuarioRegistrado) {
            return false;
        }

        // Solo guardamos el identificador de sesión.
        // Los datos públicos se recuperan del registro actualizado.
        localStorage.setItem(
            CLAVE_SESION,
            JSON.stringify({ id: usuarioRegistrado.id })
        );

        notificarCambioSesion();

        return true;

    } catch (error) {
        console.error("Error al guardar la sesión:", error);
        return false;
    }
};

// Recupera el usuario que inició sesión.
export const obtenerUsuarioActivo = () => {
    try {
        const sesionGuardada = localStorage.getItem(CLAVE_SESION);

        if (!sesionGuardada) {
            return null;
        }

        const sesion = JSON.parse(sesionGuardada);

        if (sesion.id === undefined || sesion.id === null) {
            return null;
        }

        const usuarioRegistrado = obtenerUsuarios().find(
            usuario => Number(usuario.id) === Number(sesion.id)
        );

        if (!usuarioRegistrado) {
            localStorage.removeItem(CLAVE_SESION);
            return null;
        }

        return obtenerDatosPublicos(usuarioRegistrado);

    } catch (error) {
        console.error("Error al obtener la sesión:", error);
        return null;
    }
};

// Comprueba si existe una sesión de administrador.
export const esAdministrador = () => {
    const usuario = obtenerUsuarioActivo();

    return Boolean(usuario && usuario.rol === "admin");
};

// Actualiza los datos públicos de un usuario sin modificar
// su contraseña, su identificador ni su rol.
export const actualizarDatosUsuario = (id, nuevosDatos) => {
    try {
        const usuarios = obtenerUsuarios();

        const usuarioExiste = usuarios.some(
            usuario => Number(usuario.id) === Number(id)
        );

        if (!usuarioExiste) {
            return false;
        }

        const usuariosActualizados = usuarios.map(usuario => {
            if (Number(usuario.id) !== Number(id)) {
                return usuario;
            }

            return {
                ...usuario,
                nombre: nuevosDatos.nombre,
                apellido: nuevosDatos.apellido,
                correo: nuevosDatos.correo,
                telefono: nuevosDatos.telefono,
                direccion: nuevosDatos.direccion
            };
        });

        return guardarUsuarios(usuariosActualizados);

    } catch (error) {
        console.error("Error al actualizar los datos del usuario:", error);
        return false;
    }
};

// Cierra la sesión actual.
export const cerrarSesion = () => {
    try {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem(CLAVE_SESION);
        notificarCambioSesion();
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
};