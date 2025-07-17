const router= require('express').Router();

const {obtenerRoles, crearRol, rolesTemporales, modificarRol,darRol} = require('../Controller/rol.Controller.js');

router.post('/obtenerRoles',obtenerRoles);
router.post('/crearRol',crearRol);
router.post('/rolesTemporales',rolesTemporales);
router.post('/modificarRol',modificarRol);
router.post('/darRol',darRol);
module.exports = router;