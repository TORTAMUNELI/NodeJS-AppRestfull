const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos'];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (!usuario || !usuario.estado) ? [] : [usuario],
        });
    }

    //Expresión regular para búsquedas case insensitive
    const regx = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regx }, { correo: regx }],
        $and: [{ estado: true }]
    });

    res.json({
        total: usuarios.length,
        results: usuarios,
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (!categoria || !categoria.estado) ? [] : [categoria]
        });
    }

    //Expresión regular para búsquedas case insensitive
    const regx = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regx, estado: true });

    res.json({
        total: categorias.length,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');

        return res.json({
            results: (!producto || !producto.estado) ? [] : [producto]
        });
    }

    //Expresión regular para búsquedas case insensitive
    const regx = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{ nombre: regx }, { descripcion: regx }],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre');


    /*
    Futuro desarrollo:
    Para buscar por categoría no se busca por String ("ID") sino por  ObjectID('ID')
    */
    res.json({
        total: productos.length,
        results: productos
    });
}

const buscar = async (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({ msg: `Las colecciones permitidas son: ${coleccionesPermitidas}` });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Me fui a comer, recuerdame resolver esto :)'
            })
            break;
    }
}

module.exports = {
    buscar
}