const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error('Rol invalido')
    }
}

const emailExiste = async (correo = '') => {
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error('El email ya existe');
    }
}

const usuarioExistePorId = async (id) => {
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error('El usuario no existe');
    }
    console.log(existeUsuario);
}

const existeCategoria = async (id) => {
    //Verificar si la categoría existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error('No existe la categoría');
    }

    if (!existeCategoria.estado) {
        throw new Error('No existe la categoría');
    }
}

const existeProducto = async (id) => {
    //Verificar si existe el producto
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error('No existe el producto');
    }

    if (!existeProducto.estado) {
        throw new Error('No existe el producto')
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida`);
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}