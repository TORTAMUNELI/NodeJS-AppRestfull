const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {
    try {
        const { id_token } = req.body;

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Hay que crear el usuario
            const data = {
                nombre,
                correo,
                password: 'C0ntr4s3ñ4DePru3b4_',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario Bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            id_token
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: 'Token de Google no es válido'
        });
    }
}

module.exports = { login, googleSignIn }