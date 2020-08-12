'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CancionSchema = Schema({
	numero: String,
	nombre: String,
	duracion: String,
	fichero: String,
	album: { type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Cancion', CancionSchema);