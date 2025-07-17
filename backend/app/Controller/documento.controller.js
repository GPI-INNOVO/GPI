const mongoose = require('mongoose');
const Token = require('../Controller/token.Controller.js')
const { documentos_MongooseModel } = require('../Model/documentos_Mongoose.js');
const { trabajador_MongooseModel } = require('../Model/trabajador_Mongoose.js')
const { tipoDocumento_MongooseModel } = require('../Model/tipoDocumento_Mongoose.js')
const moment = require('moment-timezone');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const crearDocumento = async (req, res) => {
    const { token, tipo, objetivo } = req.body;
    // console.log(req.body);
    const tokenValido = await Token.validartoken(token);
    if (!tokenValido.valid) {
        return res.status(401).send('Token inválido');
    }

    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo');
    }

    try {
        const resTipo = await tipoDocumento_MongooseModel.findOne({ _id: tipo });
        if (!resTipo) {
            return res.status(400).send('Tipo de documento no encontrado');
        }

        const archivo = req.file;
        const formatosPermitidos = [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/msword',
        ];

        if (!formatosPermitidos.includes(archivo.mimetype)) {
            return res.status(400).send('Formato de archivo no permitido: ' + archivo.mimetype);
        }

        const trabajador = await trabajador_MongooseModel.findOne({ Rut: objetivo });
        // Ruta donde se guardarán los archivos procesados
        const uploadPath = path.join(__dirname, `../../../TRABAJADORES/${trabajador._id}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        let finalPath;
        const fileName = `file-${Date.now()}-${archivo.originalname}`;

        if (archivo.mimetype === 'image/jpeg' || archivo.mimetype === 'image/png') {
            // Procesar imágenes en memoria con sharp
            finalPath = path.join(uploadPath, fileName.replace(/\.[^/.]+$/, '.jpeg')); // Renombrar extensión a .jpeg
            await sharp(archivo.buffer)
                .resize(1024, 1024, { fit: 'inside' }) // Redimensiona manteniendo proporción
                .toFormat('jpeg', { quality: 80 }) // Convierte a JPEG con calidad 80%
                .toFile(finalPath);
        } else {
            // Guardar otros tipos de archivos directamente desde el buffer
            finalPath = path.join(uploadPath, fileName);
            fs.writeFileSync(finalPath, archivo.buffer);
        }

        // Crear el documento en la base de datos
        const nuevoDocumento = new documentos_MongooseModel({
            _id: new mongoose.Types.ObjectId(),
            tipo: resTipo._id,
            url: finalPath, // Ruta del archivo guardado (procesado si es imagen)
            formato: archivo.mimetype,
            fecha: moment().tz('America/Santiago'),
        });

        await nuevoDocumento.save();

        // Asociar el documento al trabajador
        trabajador.documentos.push(nuevoDocumento._id);
        await trabajador.save();

        res.status(201).send('Documento creado correctamente');
    } catch (error) {
        // console.error('Error al crear el documento:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};


const obtenerDocumentos = async (req, res) => {
    const { rut, token, formato } = req.body;
    const tokenValido = await Token.validartoken(token);

    if (!tokenValido.valid) {
        return res.status(401).send('Token inválido');
    }

    try {
        const trabajador = await trabajador_MongooseModel.findOne({ Rut: rut });
        if (!trabajador) {
            return res.status(404).send('Trabajador no encontrado');
        }

        // Obtener documentos asociados
        const query = { _id: { $in: trabajador.documentos } };
        if (formato) {
            query.formato = formato; // Filtrar por formato si se proporciona
        }

        const documentos = await documentos_MongooseModel.find(query);
        res.send(documentos);
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

const eliminarDocumentos = async (req, res) => {
    const { rut, token, id } = req.body;
    const tokenValido = await Token.validartoken(token);

    if (!tokenValido.valid) {
        return res.status(401).send('Token inválido');
    }

    try {
        const trabajador = await trabajador_MongooseModel.findOne({ Rut: rut });
        if (!trabajador) {
            return res.status(404).send('Trabajador no encontrado');
        }

        const documento = await documentos_MongooseModel.findById(id);
        if (!documento) {
            return res.status(404).send('Documento no encontrado');
        }

        // Eliminar archivo físico
        fs.unlinkSync(documento.url);

        // Eliminar documento de la base de datos y del trabajador
        trabajador.documentos.pull(id);
        await trabajador.save();
        await documento.deleteOne();

        res.send('Documento eliminado correctamente');
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

const listarDocumentos = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);

    if (!tokenValido.valid) {
        return res.status(401).send('Token inválido');
    }

    try {
        const documentos = await trabajador_MongooseModel.findOne({ Rut: tokenValido.token.rut }).select('documentos');
        const datos= await documentos_MongooseModel.find({_id:{$in:documentos.documentos}}).populate({
            path:'tipo',
            select:'value'
        });

        res.send(datos);
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

const deleteDocumento= async(req,res)=>{
    const {token, id, rut}=req.body
    const tokenValido = await Token.validartoken(token);
    if (!tokenValido.valid) {
        return res.status(401).send('Token inválido');
    }
    try{
        const documento = await documentos_MongooseModel.findById(id);
        if (!documento) {
            return res.status(404).send('Documento no encontrado');
        }

        // Eliminar archivo físico
        fs.unlinkSync(documento.url);

        // Eliminar documento de la base de datos y del trabajador
        await documento.deleteOne();
        const trabajador= await trabajador_MongooseModel.findOne({Rut:rut});
        trabajador.documentos.pull(documento._id);
        await trabajador.save();
        
        res.status(201).send('Documento eliminado correctamente');
    }catch(error){
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

module.exports = { crearDocumento, obtenerDocumentos, eliminarDocumentos,listarDocumentos,deleteDocumento };