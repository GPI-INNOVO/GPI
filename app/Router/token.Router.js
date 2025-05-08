const router = require('express').Router();

const { crearToken, validartoken } = require('../Controller/token.Controller.js');


router.get('/',(req, res)=>{
    res.send('Ruta de token');
});

router.post('/creartoken', crearToken)
router.post('/validartoken', async (req, res) => {
    try {
        // Obtener el token de la solicitud
        const {token} = req.body || req.headers['authorization'];
        if (!token) {
            return res.status(400).json({ valid: false, message: 'Token no proporcionado' });
        }

        // Llamar a la función de validación de token
        const result = await validartoken(token);

        // Enviar la respuesta según el resultado
        if (result.valid) {
            res.status(200).json({ valid: true});
        } else {
            res.status(result.status).json({ valid: false, message: result.message });
        }
    } catch (error) {
        console.error('Error en el endpoint /validartoken:', error);
        res.status(500).json({ valid: false, message: 'Error interno del servidor' });
    }
});


module.exports = router;