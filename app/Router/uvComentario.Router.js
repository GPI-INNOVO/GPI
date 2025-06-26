const router = require('express').Router();

const { listarComentariosUV, crearComentarioUV, eliminarComentarioUV } = require('../Controller/ComentariosUV.Controller.js');

router.get('/', (req, res) => {
    res.send('Bienvenido a la API de ComentariosUV');
});

router.post('/listarcomentarios', listarComentariosUV);
router.post('/crearcomentario', crearComentarioUV);
router.post('/eliminarcomentario', eliminarComentarioUV);
module.exports = router;