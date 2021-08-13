const { response, request } = require("express");
const { Categoria } = require("../models");

//Paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

//Poputlate
const obtenerCategoria = async (req = request, res = response) => {
    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json(categoria);
}

const actualizarCategoria = async (req = request, res = response) => {
    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.usuarioAuth;
    const nuevaCategoria = {
        nombre,
        usuario
    };

    const anteriorCategoria = await Categoria.findByIdAndUpdate(id, nuevaCategoria);
    res.json(anteriorCategoria);
}

const borrarCategoria = async (req = request, res = response) => {
    const id = req.params.id;
    const categoria = {
        estado: false,
        usuario: req.usuarioAuth
    }

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id, categoria);
    res.json(categoriaEliminada);
}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    //Verificar que el nombre no existe ya en la base de datos
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAuth._id
    }

    const categoria = new Categoria(data);

    //GuardarDB
    await categoria.save();

    res.status(201).json(categoria);
}

module.exports = {
    crearCategoria,
    actualizarCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria
}