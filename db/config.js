const mongoose = require('mongoose');
const URL_DB = process.env.MONGODB_CNN;

const dbConnection = async () => {
    try {
        await mongoose.connect(URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}