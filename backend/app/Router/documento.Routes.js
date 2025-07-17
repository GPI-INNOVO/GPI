const router = require('express').Router();
const {uploadMemory } = require('../Middleware/multerConfig'); // Importar ambas funciones
const { crearDocumento, obtenerDocumentos, eliminarDocumentos ,listarDocumentos,deleteDocumento} = require('../Controller/documento.controller');

router.post('/crearDocumento', uploadMemory.single('file'), crearDocumento);
router.post('/obtenerDocumentos', obtenerDocumentos);
router.post('/eliminarDocumento', eliminarDocumentos);
router.post('/listarDocumentos', listarDocumentos);
router.post('/deleteDocumento', deleteDocumento);
module.exports = router