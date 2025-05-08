const router = require('express').Router();

const { crearrutas ,calcularPerimetral} = require('../Controller/ruta.Controller.js');

router.get('/',(req, res)=>{
    res.send('Ruta de ruta');
});

router.post('/crearrutas', crearrutas)
router.post('/calcularPerimetral', calcularPerimetral)

module.exports = router;