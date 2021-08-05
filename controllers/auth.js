const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -correo'
            });
        }


        //Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -estado'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -contraseña'
            });
        }

        //Generar JSON Web Token (JWT)
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = { login }