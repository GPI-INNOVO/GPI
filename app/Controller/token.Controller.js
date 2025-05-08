const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;
const { trabajador_MongooseModel } = require('../Model/trabajador_Mongoose.js');

async function crearToken(datosTrabajador) {
    const { rut,ID} = datosTrabajador; // Usar destructuración para evitar confusión con el nombre del modelo
    try {
        // Usar el modelo importado correctamente para llamar a findOne
        const usuarioExistente = await trabajador_MongooseModel.findOne({ Rut: rut });
        if (!usuarioExistente) {
            res.status(404).send('Trabajador no encontrado');
        }
        const token = jwt.sign({ rut, ID }, key, { expiresIn: '48h' });
        return token;
    } catch (error) {
        // console.error('Error al crear token:', error);
        // throw new Error('Error interno del servidor: ' + error.message);
        res.status(500).send('Error interno del servidor:'+ error.message);
    }
}

async function validartoken(token) {
    try {
        const tokenValido = jwt.verify(token, key);
        const rut = await trabajador_MongooseModel.findOne({ Rut: tokenValido.rut });
        if (tokenValido.rut == rut.Rut && tokenValido.ID == rut.ID && rut.rolTemporal!=null) {
            return { valid: true, token: tokenValido };  // Devuelve un objeto indicando que el token es válido
        } else {
            return { valid: false, status: 401, message: 'Token inválido' };  // Devuelve un objeto con el estado y el mensaje
        }
    } catch (error) {
        // console.error('Error al validar token:', error);
        if(error=='TokenExpiredError: jwt expired'){
            return { valid: false, status: 401, message: 'Token expirado' };  // Devuelve un objeto con el estado y el mensaje
        }
        return { valid: false, status: 500, message: 'Error interno del servidor: ' + error.message };  // Devuelve un objeto con el estado y el mensaje
    }
}
module.exports = { crearToken, validartoken };