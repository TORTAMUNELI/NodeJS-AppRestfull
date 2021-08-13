const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,
    validarJWT,
    tieneRol } = require('../middlewares');

const { existeCategoria } = require('../helpers/db-validators');
const { obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    obtenerCategoria,
    borrarCategoria } = require('../controllers/categorias');

/*
    {{url}}/api/categorias
*/
const router = Router();


//Obtener todas las categorías - PÚBLICO
router.get('/', obtenerCategorias);

//Obtener una categoría por ID - PÚBLICO
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

//Crear una categoría - privado - cualquier usuario
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar por id - privado - cualquier usuario
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//Borrar una categoría - privado - ADMIN ONLY
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;