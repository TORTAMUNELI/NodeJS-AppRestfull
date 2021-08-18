const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const cargarArchivos = require('./cargar-archivos');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...cargarArchivos,
}