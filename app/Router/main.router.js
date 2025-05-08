const router = require('express').Router();
const clienteRouter = require('./cliente.Router.js');
const direccionRouter = require('./direccion.Router.js');
const medidorRouter = require('./medidor.Router.js');
const rutaRouter = require('./ruta.Router.js');
const sectorRouter = require('./sector.Router.js');
const trabajadorRouter = require('./trabajador.Router.js');
const asignacion = require('./asignacion.Router.js')
const token =require('./token.Router.js');
const notificaciones = require('./notificaciones.Router.js');
const notivista= require('./notificacion_vista.Router.js')
const tipoNotificacion = require('./tipoNotificacion.Routes.js');


module.exports = app => {
    app.use('/cliente', clienteRouter);
    app.use('/direccion', direccionRouter);
    app.use('/medidor', medidorRouter);
    app.use('/ruta', rutaRouter);
    app.use('/sector', sectorRouter);
    app.use('/trabajador', trabajadorRouter);
    app.use('/token',token);
    app.use('/asignacion', asignacion);
    app.use('/notificaciones', notificaciones);
    app.use('/notificacion_vista',notivista);
    app.use('/tipoNotificacion',tipoNotificacion);
} 
