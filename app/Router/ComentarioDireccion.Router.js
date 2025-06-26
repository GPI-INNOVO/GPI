const router = require('express').Router();

const {crearComentario, obtenerComentario, eliminarComentario}= require('../Controller/ComentarioDireccion.Controller.js');

router.get('/',(req, res)=>{
    res.send('Ruta de comentario');
});

router.post('/crearComentario', crearComentario)
router.post('/obtenerComentario', obtenerComentario)
router.post('/eliminarComentario', eliminarComentario)

module.exports = router;