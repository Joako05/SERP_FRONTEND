
export const categoriasIniciales = [
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

export const obtenerCategorias = () => {
    try {
        const categoriasGuardadas = localStorage.getItem("categorias");

        if (categoriasGuardadas !== null) {
            const categorias = JSON.parse(categoriasGuardadas);

            if (Array.isArray(categorias)) {
                return categorias;
            }
        }

        return categoriasIniciales;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        return categoriasIniciales;
    }
};

export const guardarCategorias = (categorias) => {
    try {
        localStorage.setItem("categorias", JSON.stringify(categorias));
        return true;
    } catch (error) {
        console.error("Error al guardar las categorías:", error);
        return false;
    }
};