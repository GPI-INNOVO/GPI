const router = require('express').Router();
const multer = require('multer')  

const {obtenerRegionChile,creartrabajador, modificardatostrabajador, eliminartrabajador, login,listarTrabajadores,obtenerTrabajador, updatePushToken, listarTrabajadoresConectados,datosTrabajador, datosApp,fotoTrabajador} = require('../Controller/trabajador.Controller.js');

const storage = multer.memoryStorage({limits: { fileSize: 524288000 }});
const upload = multer({ storage }); 

router.get('/',(req, res)=>{
    res.send('Ruta de trabajador');
});

router.post('/creartrabajador', creartrabajador)
router.put('/modificardatostrabajador', modificardatostrabajador)
router.delete('/eliminartrabajador', eliminartrabajador)
router.post('/login', login)
router.post('/listarTrabajadores',listarTrabajadores)
router.post('/obtenerTrabajador',obtenerTrabajador)
router.post('/updatePushToken',updatePushToken)
router.get('/listarTrabajadoresConectados',listarTrabajadoresConectados)
router.post('/datosTrabajador',datosTrabajador)
router.post('/datosApp',datosApp)
router.post('/fotoTrabajador',upload.single('file'),fotoTrabajador)
router.post('/obtenerRegionChile',obtenerRegionChile)
module.exports = router;