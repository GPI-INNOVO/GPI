const router = require('express').Router();
const {uploadMemory } = require('../Middleware/multerConfig'); // Importar ambas funciones
const {
    crearNotificacion,
    eliminarNotificacion,
    obtenerNotificaciones,
    buscarNotificacion,
    detallesNotificacion,
    infoNotificaciones,
    pushNotificationOLD,
    crearNotificacionDocumento,
    obtenerNotificacionesDelUser
} = require('../Controller/notificaciones.Controller.js');

router.post('/crearNotificacion', crearNotificacion);
router.post('/eliminarNotificacion', eliminarNotificacion);
router.post('/buscarNotificacion', buscarNotificacion);
router.post('/detallesNotificacion', detallesNotificacion);
router.post('/obtenerNotificaciones', obtenerNotificaciones);
router.post('/getNoti', obtenerNotificacionesDelUser);
router.post('/infoNotificaciones', infoNotificaciones);
router.post('/pushNotification', pushNotificationOLD);
router.post('/crearNotificacionDocumento',  uploadMemory.single('file'),crearNotificacionDocumento);

module.exports = router;
