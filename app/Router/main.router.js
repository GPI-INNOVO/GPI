const router = require('express').Router();
const clienteRouter = require('./cliente.Router.js');
const direccionRouter = require('./direccion.Router.js');
const lecturaRouter = require('./lectura.Router.js');
const medidorRouter = require('./medidor.Router.js');
const rutaRouter = require('./ruta.Router.js');
const sectorRouter = require('./sector.Router.js');
const trabajadorRouter = require('./trabajador.Router.js');
const asignacion = require('./asignacion.Router.js')
const token =require('./token.Router.js');
const notificaciones = require('./notificaciones.Router.js');
const ate= require('./ate.Router.js');
const novedad = require('./novedad.Router.js');
const tipoNovedad = require('./tipoNovedad.Router.js');
const notivista= require('./notificacion_vista.Router.js')
const uvComentario = require('./uvComentario.Router.js');
const direccionComentario = require('./ComentarioDireccion.Router.js');
const tipoNotificacion = require('./tipoNotificacion.Routes.js');
const documentoRouter = require('./documento.Routes.js');
const tipoDocumentoRouter = require('./tipoDocumento.Routes.js');
const rol= require('./rol.Routes.js');
const permiso= require('./permiso.Routes.js');
const excelRouter = require('./excel.Router.js');

module.exports = app => {
    app.use('/cliente', clienteRouter);
    app.use('/direccion', direccionRouter);
    app.use('/lectura', lecturaRouter);
    app.use('/medidor', medidorRouter);
    app.use('/ruta', rutaRouter);
    app.use('/sector', sectorRouter);
    app.use('/trabajador', trabajadorRouter);
    app.use('/token',token);
    app.use('/asignacion', asignacion);
    app.use('/notificaciones', notificaciones);
    app.use('/middleware',ate);
    app.use('/novedad', novedad);
    app.use('/tipoNovedad', tipoNovedad);
    app.use('/notificacion_vista',notivista);
    app.use('/uvComentario', uvComentario); 
    app.use('/comentarioDireccion', direccionComentario);
    app.use('/tipoNotificacion',tipoNotificacion);
    app.use('/documento', documentoRouter);
    app.use('/tipoDocumento', tipoDocumentoRouter);
    app.use('/rol',rol);
    app.use('/permiso',permiso);
    app.use('/excel', excelRouter);
} 
