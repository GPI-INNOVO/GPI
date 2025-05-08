const mongoose = require("mongoose");

const trabajador_Mongoose = new mongoose.Schema({
    "Rut": { type: String, required: true ,unique:true},//
    "Nombre": { type: String, required: true },//
    "cargo": { type: String, required: true }, "cargo": { //
        type: String,
        required: true,
        enum: ['administracion', 'lector', 'supervisor', 'inspector']
    },
    "perfil": { type: String, required: false },//implementar documentos?
    "apoyo": [{ type: mongoose.Schema.Types.ObjectId, required: true }],  //  
    "correo": { type: String, required: true },//
    "clave": { type: String, required: true },
    "notificaciones": [{ type: mongoose.Schema.Types.ObjectId, required: true }],//
    "vistas": [{ type: mongoose.Schema.Types.ObjectId, required: false }],//
    "documentos": [{ type: mongoose.Schema.Types.ObjectId }],//
    "rol": { type: mongoose.Schema.Types.ObjectId, required: false },//
    "rolTemporal": { //
        "rol": { type: mongoose.Schema.Types.ObjectId, required: false },
        "expiracion": { type: Date, required: false }
    },
    "ID": { type: String, required: false },
    "tokenPush": { type: String, required: false },
    "lastUbication": {
        "lat": { type: String, required: false },
        "lng": { type: String, required: false },
        "date": { type: Date, required: false }
    }
})

const trabajador_MongooseModel = mongoose.model('trabajador', trabajador_Mongoose);

module.exports = { trabajador_MongooseModel };