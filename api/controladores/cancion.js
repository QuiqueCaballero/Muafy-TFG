'use strict'

var mongoosePaginate = require('mongoose-pagination');

var path = require('path');
var fs = require('fs');

var Artista = require('../modelos/artista');
var Cancion = require('../modelos/cancion');
var Album = require('../modelos/album');

function getCancion(req, res){
	var cancionId = req.params.id;

	Cancion.findById(cancionId).populate({path: 'album'}).exec((err, cancion) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!cancion) {
				res.status(404).send({message: 'La canción no existe'});
			}else{
				res.status(200).send({cancion});
			}
		}
	});
}

function guardarCancion(req, res){
	var cancion = new Cancion();

	var parametros = req.body;

	cancion.numero = parametros.numero;
	cancion.nombre = parametros.nombre;
	cancion.fichero = null;
	cancion.duracion = parametros.duracion;
	cancion.album = parametros.album;


	cancion.save((err, cancionStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar la canción'});
		}else{
			if(!cancionStored){
				res.status(404).send({message: 'No se ha guardado la canción'});
			}else{
				res.status(200).send({cancion: cancionStored});
			}
		}
	});
}

function getCanciones(req, res){
	
	var albumId = req.params.album;
	if (!albumId) {
		var find = Cancion.find({}).sort('numero');
	}else{
		var find = Cancion.find({album: albumId}).sort('numero');
	}

	find.populate({
		path: 'album',
		populate:{
			path: 'artista',
			model: 'Artista'
		}
	}).exec((err, canciones) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!canciones){
				res.status(404).send({message: 'No hay canciones'});
			}else{
				res.status(200).send({canciones});
			}
		}
	});
}

function actualizarCancion(req, res){
	var cancionId = req.params.id;
	var update = req.body;

	Cancion.findByIdAndUpdate(cancionId, update, (err, cancionUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error al guardar canción'});
		}else{
			if (!cancionUpdated) {
				res.status(404).send({message: 'Canción no actualizado'});
			}else{
				res.status(200).send({cancion: cancionUpdated});
			}
		}
	});
}

function borrarCancion(req, res){

	var cancionId = req.params.id;

	Cancion.findByIdAndRemove(cancionId, (err, cancionRemoved) =>{
		if (err) {
			res.status(500).send({message: 'Error al eliminar canción'});
		}else{
			if (!cancionRemoved) {
				res.status(404).send({message: 'canción no se ha eliminado'});
			}else{
				res.status(200).send({cancion: cancionRemoved});
			}
		}
	});
}

function cargarFichero(req, res) {
	var cancionId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.fichero.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var extension_split = file_name.split('\.');
		var file_extension = extension_split[1];

		if (file_extension == 'mp3' || file_extension == 'ogg') {
			Cancion.findByIdAndUpdate(cancionId, {fichero: file_name}, (err, cancionUpdated) =>{
				if(!cancionUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la canción'});
				}else{
					res.status(200).send({cancion: cancionUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'El formato del fichero no es válida'})
		}

		console.log(extension_split);
	}else{
		res.status(200).send({message: 'No ha subido ningun fichero'})
	}
}

function getCancionFile(req, res){
	var cancionFile = req.params.cancionFile;
	var path_file = './uploads/canciones/'+cancionFile;

	fs.exists(path_file, function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe canción'})
		}
	});
}

module.exports = {
	getCancion,
	guardarCancion,
	getCanciones,
	actualizarCancion,
	borrarCancion,
	cargarFichero,
	getCancionFile
};