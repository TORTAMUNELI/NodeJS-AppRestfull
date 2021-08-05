const { request, response } = require("express")


const esAdminRol = (req = request, res = response, next) => {
    if (!req.usuarioAuth) {
        return res.status(500).json({
            msg: 'Verificar el rol sin token - Contacte al administrador'
        });
    }

    const { rol, nombre } = req.usuarioAuth;

    if (rol !== 'ADMIN') {
        return res.status(401).json({
            msg: `${nombre} no es admin`
        });
    }

    next();
}

const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuarioAuth) {
            return res.status(500).json({
                msg: 'Verificar el rol sin token - Contacte al administrador'
            });
        }

        if (!roles.includes(req.usuarioAuth.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        next();
    }
}

module.exports = { esAdminRol, tieneRol }