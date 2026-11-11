
const ITERACIONES_PBKDF2 = 310000;
const LONGITUD_SAL = 16;
const LONGITUD_HASH = 256;

const obtenerCrypto = () => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            "Tu navegador no permite utilizar las funciones criptográficas necesarias."
        );
    }

    return window.crypto;
};

const convertirABase64 = (bytes) => {
    let texto = "";

    bytes.forEach(byte => {
        texto += String.fromCharCode(byte);
    });

    return window.btoa(texto);
};

const convertirDesdeBase64 = (texto) => {
    const binario = window.atob(texto);

    return Uint8Array.from(
        binario,
        caracter => caracter.charCodeAt(0)
    );
};

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

// Guarda la lista de usuarios.
export const guardarUsuarios = (nuevosUsuarios) => {
    try {
        localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
        return true;
    } catch (error) {
        console.error("Error al guardar los usuarios:", error);
        return false;
    }
};

// Genera un ID numérico para el próximo usuario.
export const generarIdUsuario = (listaUsuarios) => {
    if (listaUsuarios.length === 0) {
        return 1;
    }

    const ids = listaUsuarios.map(usuario => Number(usuario.id));

    return Math.max(...ids) + 1;
};

// Genera una sal y un hash a partir de la contraseña.
export const crearCredenciales = async (password) => {
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

// Comprueba si la contraseña ingresada coincide con la registrada.
export const verificarCredenciales = async (password, usuario) => {
    try {
        if (
            !usuario ||
            !usuario.passwordSalt ||
            !usuario.passwordHash ||
            !usuario.passwordIteraciones
        ) {
            return false;
        }

        const salt = convertirDesdeBase64(usuario.passwordSalt);

        const hashCalculado = await generarHash(
            password,
            salt,
            usuario.passwordIteraciones
        );

        const hashGuardado = convertirDesdeBase64(usuario.passwordHash);

        if (hashCalculado.length !== hashGuardado.length) {
            return false;
        }

        // Compara todos los bytes sin detenerse en la primera diferencia.
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

// Guarda los datos públicos del usuario que inició sesión.
export const guardarSesion = (usuario) => {
    try {
        const usuarioSeguro = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            telefono: usuario.telefono,
            direccion: usuario.direccion
        };

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioSeguro)
        );

        // Se conserva esta clave para compatibilidad con Perfil.jsx.
        localStorage.setItem(
            "usuario",
            JSON.stringify(usuarioSeguro)
        );

        return true;
    } catch (error) {
        console.error("Error al guardar la sesión:", error);
        return false;
    }
};

// Recupera el usuario que inició sesión.
export const obtenerUsuarioActivo = () => {
    try {
        const usuarioGuardado =
            localStorage.getItem("usuarioActivo") ||
            localStorage.getItem("usuario");

        if (!usuarioGuardado) {
            return null;
        }

        return JSON.parse(usuarioGuardado);
    } catch (error) {
        console.error("Error al obtener la sesión:", error);
        return null;
    }
};

// Cierra la sesión actual.
export const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
};
