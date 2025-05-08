const mongoose = require('mongoose');
const { cliente_MongooseModel: cliente } = require('../Model/cliente_Mongoose');
const { medidor_MongooseModel: medidor } = require('../Model/medidor_Mongoose');
const { direccion_MongooseModel: direccion } = require('../Model/direccion_Mongoose');
const Token = require('../Controller/token.Controller.js')

const crearcliente = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido){ 
        const { NumeroCliente, nombre } = req.body;
        try {
            // Corrección aquí: usa directamente cliente en lugar de cliente.cliente_MongooseModel
            const usuarioExistente = await cliente.findOne({ NumeroCliente });
            if (usuarioExistente) {
                return res.status(400).send('El usuario ya existe');
            }
            const nuevocliente = new cliente({
                _id: new mongoose.Types.ObjectId(),
                nombre,
                NumeroCliente
            });
            await nuevocliente.save();
            res.status(201).send('Cliente registrado correctamente');
        } catch (error) {
            console.error('Error al registrar cliente:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else {
        res.status(401).send('Token inválido');
    }
};

const obtenercliente = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido){    
        const { NumeroCliente } = req.body;
        try {
            // Corrección aquí: usa directamente cliente en lugar de cliente.cliente_MongooseModel
            const clienteEncontrado = await cliente.findOne({ NumeroCliente });
            if (clienteEncontrado) {
                res.status(200).json({ message: 'Cliente encontrado', cliente: clienteEncontrado });
            } else {
                res.status(404).send('Cliente no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }else {
        res.status(401).send('Token inválido');
    }
};

const eliminarCliente = async (req, res) => {
    const { token } = req.body;
    const tokenValido = await Token.validartoken(token);
    if (tokenValido){   
        const { NumeroCliente } = req.body;

        try {
            const clienteExistente = await cliente.findOne({ NumeroCliente });
            if (!clienteExistente) {
                return res.status(404).send('Cliente no existente');
            }

            // Eliminar direcciones asociadas
            const direccionesEliminadas = await direccion.deleteMany({ NumeroCliente: clienteExistente._id });
            // console.log(`${direccionesEliminadas.deletedCount} direcciones eliminadas.`);

            // Eliminar medidores asociados
            const medidoresEliminados = await medidor.deleteMany({ NumeroCliente: clienteExistente._id });
            // console.log(`${medidoresEliminados.deletedCount} medidores eliminados.`);

            // Finalmente eliminar el cliente
            await cliente.deleteOne({ _id: clienteExistente._id });

            res.status(200).send('Cliente y todos los registros asociados eliminados correctamente');
        } catch (error) {
            console.error('Error al eliminar el cliente y registros asociados:', error);
            res.status(500).send('Error interno del servidor');
        }
    }else {
        res.status(401).send('Token inválido');
    }
};

module.exports = { crearcliente, eliminarCliente, obtenercliente };
