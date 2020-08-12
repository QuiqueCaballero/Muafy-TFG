'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
	nombre: String,
	apellidos: String,
	email: String,
	contrasenya: String,
	rol: String,
	imagen: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);