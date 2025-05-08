const db = require('../Model/server.js');
const mongoose = require('mongoose');
const {sector_MongooseModel:sector} = require('../Model/sector_Mongoose.js')
const {direccion_MongooseModel:direccion} = require('../Model/direccion_Mongoose.js')
const {medidor_MongooseModel:medidor, medidor_MongooseModel} = require('../Model/medidor_Mongoose.js')
const {trabajador_MongooseModel: trabajador_MongooseModel} = require('../Model/trabajador_Mongoose.js')
const {asignacion_MongooseModel:Asignacion} = require('../Model/asignacion_Mongose.js')
const {apoyo_MongooseModel:apoyo} = require('../Model/apoyo.js')
const Token = require('../Controller/token.Controller.js')
const Sector = require('../Controller/sector.Controller.js');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const agregardireccion = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){   
        const {NumeroSector ,Numeromedidor,calle, numero, block, depto, comuna, ciudad, region,lat,lng} = req.body;
        try{
            const sectorExistente =await sector.findOne({NumeroSector})
            const medidorExistente = await medidor.findOne({NumeroMedidor:Numeromedidor})
            const direccionExistente = await direccion.findOne({calle:calle, numero:numero});
            if (!sectorExistente){
                return res.status(400).send('Sector no existente');
            }
            if (!medidorExistente){
                return res.status(400).send('Medidor no existente');
            }
            if (direccionExistente){
                return res.status(400).send('Direccion existente')
            }
            const nuevadireccion = new direccion({
                _idDireccion: new mongoose.Types.ObjectId(),
                calle, 
                numero, 
                block, 
                depto, 
                comuna, 
                ciudad, 
                region,
                NumeroMedidor: medidorExistente._id,
                NumeroSector: sectorExistente._id,
                LAT: lat,
                LNG: lng
            })
            await nuevadireccion.save();
            await Sector.calcularPerimetro(sectorExistente._id);
            res.status(201).send('Direccion registrada correctamente');
        }catch (error) {
            // console.error('Error al registrar direccion:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else {
        res.status(401).send('Token inválido');
    }
};

const modificardireccion = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){       
        const {Numeromedidor, Nuevocalle, Nuevonumero, Nuevoblock, Nuevodepto, Nuevonombre, Nuevocomuna, Nuevociudad, Nuevoregion } = req.body;
        try{
            const direccionmedidor = await medidor.findOne({NumeroMedidor:Numeromedidor});
            const direccionexistente = await direccion.findOne({NumeroMedidor: direccionmedidor._id});
            if (!direccionexistente) {
                return res.status(404).send('Direccion no encontrado');
            }
            if (Nuevocalle){direccionexistente.calle = Nuevocalle};
            if (Nuevonumero){direccionexistente.numero = Nuevonumero};
            direccionexistente.block = Nuevoblock !== undefined ? Nuevoblock : null;
            direccionexistente.depto = Nuevodepto !== undefined ? Nuevodepto : null;
            if (Nuevonombre){direccionexistente.nombre = Nuevonombre};
            if (Nuevocomuna){direccionexistente.comuna = Nuevocomuna};
            if (Nuevociudad){direccionexistente.ciudad = Nuevociudad};
            if (Nuevoregion){direccionexistente.region = Nuevoregion};
            await direccionexistente.save();
            return res.send('Diereccion modificada correctamente');
        } catch (error) {
            // console.error('Error al modificar direccion:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else {
        res.status(401).send('Token inválido');
    }
};


const obtenerdireccion = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){   
        const {Numeromedidor} = req.body;
        try{
            const medidor = await medidor_MongooseModel.findOne({NumeroMedidor: Numeromedidor});
            const trabajador = await trabajador_MongooseModel.findOne({Rut: tokenValido.token.rut});
            const lastapoyo= await apoyo.findOne({_id: trabajador.apoyo[trabajador.apoyo.length - 1]});

            const hoy = dayjs().startOf('day').subtract(3, 'hours');
            const hoy2 = dayjs().endOf('day').subtract(3, 'hours');
            const asignacion = await Asignacion.find({
                Trabajador: trabajador._id,
                fecha_asignacion: {
                    $gte: hoy.toDate(),
                    $lte: hoy2.toDate()
                }
            })
            const asignacionapoyo = await Asignacion.findById(lastapoyo.asignacion);
            asignacion.push(asignacionapoyo);
            if (!asignacion) {
                return res.status(404).send('No tienes asignaciones para hoy');
            }
            
            if (!medidor) {
                return res.status(404).send('Medidor no encontrado.');
			}
			
			let direccionexistente = null;
			for (let i = 0; i < asignacion.length; i++) {
                direccionexistente = await direccion.findOne({
					NumeroMedidor: medidor._id,
					NumeroSector: asignacion[i].NumeroSector
				});
				if (direccionexistente) break;
			}
        
            res.send({
                direccion: direccionexistente._id,
                calle: direccionexistente.calle,
            });
        } catch (error) {
                // console.error('Error al obtener direccion cliente:', error);
                res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        res.status(401).send('Token inválido');
    }
};

const obtenerDireccionesSector = async(req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){
        const {NumeroSector} = req.body;
        try {
            const sectorExistente = await sector.findOne({NumeroSector});
            if (!sectorExistente){
                return res.status(404).send('Sector no encontrado');
            }
            const direcciones = await direccion.find({NumeroSector: sectorExistente._id});
            res.send(direcciones);
        } catch (error) {
            // console.error('Error al obtener direcciones:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        res.status(401).send('Token inválido');
    }
}

const modificarCoord= async(req,res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){
        const {Numeromedidor, lat, lng} = req.body;
        try{
            const medidor = await medidor_MongooseModel.findOne({NumeroMedidor: Numeromedidor});
            if (!medidor){
                return res.status(404).send('Medidor no encontrado.');
            }
            const direccionexistente = await direccion.findOne({NumeroMedidor: medidor._id});
            direccionexistente.LAT = lat;
            direccionexistente.LNG = lng;
            await direccionexistente.save();
            res.send('Coordenadas actualizadas correctamente');
        } catch (error) {
            // console.error('Error al modificar coordenadas:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        res.status(401).send('Token inválido');
    }
}

const comentarDireccion = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){
        const {Numeromedidor, comentario} = req.body;
        try{
            const medidor = await medidor_MongooseModel.findOne({NumeroMedidor: Numeromedidor});
            if (!medidor){
                return res.status(404).send('Medidor no encontrado.');
            }
            const direccionexistente = await direccion.findOne({NumeroMedidor: medidor._id});
            direccionexistente.comentario = comentario;
            await direccionexistente.save();
            res.send('Comentario agregado correctamente');
        } catch (error) {
            // console.error('Error al agregar comentario:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        res.status(401).send('Token inválido');
    }
}

const listadirecciones=async(req,res)=>{
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido.valid){
        try{
            const trabajador = await trabajador_MongooseModel.findOne({Rut: tokenValido.token.rut});
            const lastapoyo = await apoyo.findOne({_id: trabajador.apoyo[trabajador.apoyo.length - 1]});
            const asignacion = await Asignacion.findOne({Trabajador:trabajador._id, fecha_asignacion:{$gte:dayjs().startOf('day').subtract(3,'hours').toDate(),$lte:dayjs().endOf('day').subtract(3,'hours').toDate()}});
            if (!asignacion){
                return res.status(204).send('No tienes asignaciones para hoy');
            }
            const direcciones = await direccion.find({NumeroSector:asignacion.NumeroSector},{ _id: 0, calle: 1 }).populate('NumeroMedidor','NumeroMedidor');
            
            
            if (dayjs().isBetween(dayjs(lastapoyo.fecha_inicio), dayjs(lastapoyo.fecha_fin), null, '[]')) {
                const ASIGNesapoyo= await Asignacion.findById(lastapoyo.asignacion);
                const direccionapoyo = await direccion.find(
                    { NumeroSector: ASIGNesapoyo.NumeroSector },
                    { _id: 0, calle: 1 }
                ).populate('NumeroMedidor', 'NumeroMedidor _id');
                direcciones.push(direccionapoyo);
            }
            const direcciones2 = direcciones.map((direccion) => {
                return {"calle":direccion.calle, "_id":direccion.NumeroMedidor._id,"NumeroMedidor":direccion.NumeroMedidor.NumeroMedidor.toString()};
                
            });
            res.send(direcciones2);

        }catch (error){
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else{
        res.status(401).send('Token inválido');
    }
}

// AGREGRAR DELETE DIRECCION

module.exports = {agregardireccion, modificardireccion, obtenerdireccion,obtenerDireccionesSector,modificarCoord,comentarDireccion ,listadirecciones};