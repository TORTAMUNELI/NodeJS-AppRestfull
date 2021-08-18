const { request, response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {

    try {
        //Imagenes
        const nombre = await subirArchivo(req.files, ['jpg'], 'perfiles');

        res.json({
            nombre
        });
    } catch (err) {
        res.status(400).json({ err });
    }
}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                msg: 'Me fui a comer, recuerdame arreglar esto :)'
            });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        //Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    try {
        const nombre = await subirArchivo(req.files, ['jpg'], coleccion);
        modelo.img = nombre;

        await modelo.save();

        res.json(modelo);
    } catch (err) {
        res.status(500).json({ err });
    }
}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                msg: 'Me fui a comer, recuerdame arreglar esto :)'
            });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }

    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        // const nombre = await subirArchivo(req.files, ['jpg'], coleccion);
        modelo.img = secure_url;

        await modelo.save();

        res.json(modelo);
    } catch (err) {
        res.status(500).json({ err });
    }
}

const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                msg: 'Me fui a comer, recuerdame arreglar esto :)'
            });
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.status(404).sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}