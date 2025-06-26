const mongoose = require('mongoose');
const TipoComentario = mongoose.model('TipoComentario');
const Token = require('../Controller/token.Controller.js')


const crearComentario = async (req, res) => {
    try {
        const {token, nombre} = req.body;
        const tokenValido = await Token.validartoken(token);
        if (tokenValido.valid) {
            const tipoComentario = new TipoComentario({
                _id: new mongoose.Types.ObjectId(),
                value: nombre,
            });
            await tipoComentario.save();
            res.status(201).send('Tipo de comentario creado');
        } else {
            res.status(401).send('Token inválido');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

const obtenerComentario = async (req, res) => {
    try {
        const {token} = req.body;
        const tokenValido = await Token.validartoken(token);
        if (tokenValido.valid) {
            const tipos = await TipoComentario.find();
            res.status(200).json(tipos);
        } else {
            res.status(401).send('Token inválido');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

const eliminarComentario = async (req, res) => {
    try {
        const {token, id} = req.body;
        const tokenValido = await Token.validartoken(token);
        if (tokenValido.valid) {
            await TipoComentario.findByIdAndDelete(id);
            res.status(200).send('Tipo de comentario eliminado');
        } else {
            res.status(401).send('Token inválido');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

module.exports = {crearComentario, obtenerComentario, eliminarComentario};