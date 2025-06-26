const db = require('../Model/server.js');
const mongoose = require('mongoose');
const {sector_MongooseModel:sector} = require('../Model/sector_Mongoose.js')
const {ruta_MongooseModel:ruta} = require('../Model/ruta_Mongoose.js')
const {trabajador_MongooseModel:trabajador} = require('../Model/trabajador_Mongoose.js')
const {medidor_MongooseModel:medidor} = require('../Model/medidor_Mongoose.js')
const {lectura_MongooseModel:lecturao} = require('../Model/lectura_Mongoose.js')
const dayjs = require('dayjs');
const Token = require('../Controller/token.Controller.js')

const crearlectura = async (req, res) => {
    const {  token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){   
        const { NumeroRuta, NumeroSector, NumeroMedidor, lectura, foto, clave} = req.body;
        try{
            const trabajadorexistente = await trabajador.findOne({Rut: tokenValido.token.rut});
            const sectorexistente = await sector.findOne({NumeroSector})
            const rutaexistente = await ruta.findOne({NumeroRuta})
            const medidorexistente = await medidor.findOne({NumeroMedidor})
            if (!sectorexistente) {
                return res.status(404).send('Sector no encontrado');
            }
            if (!trabajadorexistente) {
                return res.status(404).send('Trabajador no encontrado');
            }
            if (!rutaexistente) {
                return res.status(404).send('Ruta no encontrada');
            }
            if (!medidorexistente) {
                return res.status(404).send('Medidor no encontrado');
            }
            const nuevalectura = new lecturao({
                _idLectura: new mongoose.Types.ObjectId(),
                fecha: new dayjs().format('YYYY-MM-DD HH:mm:ss'), 
                lectura,
                foto,
                clave,
                NumeroMedidor: medidorexistente._id,
                NumeroRuta: rutaexistente._id,
                NumeroSector: sectorexistente._id,
                trabajador: trabajadorexistente._id
            });
            await nuevalectura.save();
            res.status(201).send('Lerctura registrada correctamente');
        }catch (error) {
            // console.error('Error al registrar lectura:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else {
        res.status(401).send('Token inválido');
    }
};


const obtenerlectura = async (req, res) => {
    const {  token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid) {   
        const { NumeroMedidor, fecha } = req.body;
        try {
            const Medidor = await medidor.findOne({ NumeroMedidor }).lean();
            if (!Medidor) {
                return res.status(404).send('Medidor no encontrado.');
            }

            const fechaInicio = dayjs(fecha).startOf('month').toDate(); 
            const fechaFin = dayjs(fecha).endOf('month').toDate();
            const lectura = await lecturao.findOne({
                fecha: {
                    $gte: fechaInicio, 
                    $lt: fechaFin 
                },
                NumeroMedidor: Medidor._id
            }).select('_id').lean(); // Seleccionamos solo el campo _id

            if (!lectura) {
                return res.status(404).send('Lectura no encontrada.');
            }

            res.status(200).json({ 
                mensaje: 'Lectura encontrada', 
                lecturaId: lectura._id 
            }); 
        } catch (error) {
            // console.error('Error al obtener la lectura:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        res.status(401).send('Token inválido');
    }
};


module.exports = {crearlectura, obtenerlectura}