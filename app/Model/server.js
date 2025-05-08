const mongoose = require('mongoose');
const clienteModel = require('./cliente_Mongoose.js');
const direccionModel = require('./direccion_Mongoose.js');
const medidorModel = require('./medidor_Mongoose.js');
const rutaModel = require('./ruta_Mongoose.js');
const sectorModel = require('./sector_Mongoose.js');
const trabajadorModel = require('./trabajador_Mongoose.js');
const notificacionesModel = require('./notificacion_Mongoose.js');
const notificacion_vista_MongooseModel = require('./notificacion_vista.Mongoose.js');
const tipoNotificacionSchema = require('./tipoNotificacion_Mongoose.js');
const asignacion = require('./asignacion_Mongose.js');

// Conexión a MongoDB
const db = {};
db.mongoose = mongoose;
db.clienteModel = clienteModel;
db.direccionModel = direccionModel;
db.medidorModel = medidorModel;
db.rutaModel = rutaModel;
db.sectorModel = sectorModel;
db.trabajadorModel = trabajadorModel;
db.notificacionesModel = notificacionesModel;
db.notificacion_vista_MongooseModel = notificacion_vista_MongooseModel;
db.tipoNotificacionSchema = tipoNotificacionSchema;
db.asignacion_MongooseModel = asignacion;
module.exports = db;
