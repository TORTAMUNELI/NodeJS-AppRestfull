const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

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
    }

    async conectarDB() {
        await dbConnection();
    }
    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`The server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;