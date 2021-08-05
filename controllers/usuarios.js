const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    // const { q, nombre = '', apk } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;
    //Validar contra base de datos
    if (password) {
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json(usuario);
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();
    res.status(201).json({
        usuario
    });
}

const usuariosDelete = async (req, res) => {
    const { id } = req.params;

    //Borrarlo de la base de datos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuarioAuth = req.usuarioAuth;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json({ usuario });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}