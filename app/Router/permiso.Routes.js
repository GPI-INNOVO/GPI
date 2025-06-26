const router= require('express').Router();

const {obtenerPermisos, crearPermiso, eliminarPermiso} = require('../Controller/permiso.Controller.js');

router.post('/obtenerPermisos',obtenerPermisos);
router.post('/crearPermiso',crearPermiso);
router.post('/eliminarPermiso',eliminarPermiso);

module.exports = router;