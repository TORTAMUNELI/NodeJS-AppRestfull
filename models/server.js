const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            cargas: '/api/cargas'
        };

        //Conectar a la base de datos
        this.conectarDB();

        //Middlewares
        this.middleWares();

        //Rutas
        this.routes();
    }


    /* Un middleWare es una función que se ejecuta antes de llamar un controlador*/
    middleWares() {
        //Directorio público
        this.app.use(express.static('public'));

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    async conectarDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.cargas, require('../routes/cargas'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`The server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;