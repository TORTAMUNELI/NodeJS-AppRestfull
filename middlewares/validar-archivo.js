const { response, request } = require("express")

const validarArchivoSubir = (req = request, res = response, next) => {

    //Validar si viene un archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos por subir'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir
}