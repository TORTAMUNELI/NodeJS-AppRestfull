const { request, response } = require('express');
const { Producto, Categoria } = require('../models');

//Obtener todos los productos - Público
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //Confirmar si esta en la base de datos
    const query = {
        estado: true,
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

//Obtener producto por id - Público
const obtenerProductoPorId = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    res.json(producto);
}

//Actualizar producto por id - Privado - Cualquier Usuario Autenticado
const actualizarProducto = async (req = request, res = response) => {
    const { estado, usuario, ...producto } = req.body;
    const { id } = req.params;
    const usuarioAuth = req.usuarioAuth;

    const data = {
        ...producto,
        usuario: usuarioAuth
    }


    const antiguo = await Producto.findByIdAndUpdate(id, data);
    res.json(antiguo);
}

//Crear producto - Privado - Cualquier Usuario Autenticado
const crearProducto = async (req = request, res = response) => {
    const { nombre, precio = '0', categoria, descripcion = '', } = req.body;

    //Usuario Autenticado
    const usuarioAuth = req.usuarioAuth;

    //Verificar que no exste el produto en DB
    const productoDB = await Producto.findOne({ nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe`
        });
    }

    //Guardar el producto en DB
    const producto = new Producto({ nombre, usuario: usuarioAuth, precio, categoria, descripcion });
    await producto.save();

    return res.status(201).json(producto);
}

//Eliminar producto por id - Privado - Solo ADMIN
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const data = {
        estado: false,
        usuario: req.usuarioAuth
    }

    const productoEliminado = await Producto.findByIdAndUpdate(id, data);

    res.json({
        productoEliminado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    crearProducto,
    borrarProducto
}