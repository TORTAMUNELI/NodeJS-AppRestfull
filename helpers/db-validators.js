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

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId
}