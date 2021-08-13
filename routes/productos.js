const { Router } = require('express');
const { check } = require('express-validator');

const {
    obtenerProductos,
    crearProducto,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tieneRol } = require('../middlewares');;
/*
{{url}}/api/productos
*/
const router = Router();

//Obtener todos los productos - Público
router.get('/', obtenerProductos);

//Obtener producto por id - Público
router.get('/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductoPorId);

//Actualizar producto por id - Privado - Cualquier Usuario Autenticado
router.put('/:id', [
    validarJWT,
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeProducto),
    check('categoria', 'ID de categoria no valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], actualizarProducto);

//Crear producto - Privado - Cualquier Usuario Autenticado
router.post('/', [
    validarJWT,
    check('nombre').not().isEmpty(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

//Eliminar producto por id - Privado - Solo ADMIN
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN'),
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

module.exports = router;