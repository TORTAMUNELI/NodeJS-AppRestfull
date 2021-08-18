const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files, extensionesValidas, carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;

        //Obtener extensión del archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validar la extensión del archivo
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname + '/../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemp);
        });
    });



}

module.exports = {
    subirArchivo
}