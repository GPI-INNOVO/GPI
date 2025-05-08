//listar,
const mongoose = require('mongoose');
const {
    notificacion_vista_MongooseModel,
} = require('../Model/notificacion_vista.Mongoose.js');
const {
    notificaciones_MongooseModel,
} = require('../Model/notificacion_Mongoose.js');
const { trabajador_MongooseModel } = require('../Model/trabajador_Mongoose.js');
const Token = require('../Controller/token.Controller.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const moment = require('moment-timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const registroNotificacion = async (req, res) => {
    try {
        const { token } = req.body;
        const tokenValido = await Token.validartoken(token);

        if (tokenValido.valid) {
            const { idNotificacion } = req.body;
            
            const trabajador = await trabajador_MongooseModel.findOne({
                Rut: tokenValido.token.rut,
            });
            const notificacion = await notificaciones_MongooseModel.findOne({
                _id: idNotificacion,
            });
            if (trabajador && notificacion) {
                const notificacionVista = new notificacion_vista_MongooseModel({
                    notificacion: idNotificacion,
                    trabajador: trabajador._id,
                    tiempo: moment()
                        .tz('America/Santiago')
                        .format('DD-MM-YYYY'),
                });
                await trabajador_MongooseModel.updateOne(
                    { Rut: tokenValido.token.rut },
                    {
                        $pull: { notificaciones: idNotificacion },
                        $push: { vistas: idNotificacion },
                    }
                );
                await notificacionVista.save();
                //Evento de cambio de bolsa
                res.status(200).send('Notificación registrada');
            } else {
                res.status(404).send(
                    trabajador,
                    notificacion,
                    'No se encontró el trabajador o la notificación'
                );
            }
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

module.exports = { registroNotificacion };
