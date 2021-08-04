const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete } = require('../controllers/usuarios');
const { esRolValido, emailExiste, usuarioExistePorId, } = require('../helpers/db-validators');
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('rol', 'No es un rol válido').isIn(['ADMIN', 'USER']),
    check('rol').custom((rol) => esRolValido(rol)),
    check('correo').custom((correo) => emailExiste(correo)),
    validarCampos,
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    validarCampos
], usuariosDelete);


module.exports = router;