const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);

        const usuarioAuth = await Usuario.findById(uid);

        //Verificar que exista en la base de datos
        if (!usuarioAuth) {
            return res.status(401).json({
                msg: 'No hay token en la petición - usuario no existe en db'
            });
        }

        //Uid tiene un estado true
        if (!usuarioAuth.estado) {
            return res.status(401).json({
                msg: 'No hay token en la petición - estado false'
            });
        }

        req.usuarioAuth = usuarioAuth;

        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}