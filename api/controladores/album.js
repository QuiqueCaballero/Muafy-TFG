'use strict'

var mongoosePaginate = require('mongoose-pagination');

var path = require('path');
var fs = require('fs');

var Artista = require('../modelos/artista');
var Cancion = require('../modelos/cancion');
var Album = require('../modelos/album');

function getAlbum(req, res){
	var albumId = req.params.id;

	return Album.findById(albumId).populate({path: 'artista'}).exec((err, album) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!album) {
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function guardarAlbum(req, res){
	var album = new Album();

	var parametros = req.body;

	album.titulo = parametros.titulo;
	album.descripcion = parametros.descripcion;
	album.imagen = 'null';
	album.anyo = parametros.anyo;
	album.artista = parametros.artista;


	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function getAlbumes(req, res){
	
	var artistaId = req.params.artista;
	if (!artistaId) {
		//sacar los álbumes de la base de datos
		var find = Album.find({}).sort('titulo');
	}else{
		var find = Album.find({artista: artistaId}).sort('anyo');
	}

	find.populate({path: 'artista'}).exec((err, albums) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay álbumes'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function actualizarAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error al guardar album'});
		}else{
			if (!albumUpdated) {
				res.status(404).send({message: 'Album no actualizado'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function borrarAlbum(req, res){

	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
		if (err) {
			res.status(500).send({message: 'Error al eliminar album'});
		}else{
			if (!albumRemoved) {
				res.status(404).send({message: 'album no se ha eliminado'});
			}else{
				Cancion.find({album: albumId}).remove((err, cancionRemoved) =>{
					if (err) {
						res.status(500).send({message: 'Error al eliminar canción'});
					}else{
						if (!cancionRemoved) {
							res.status(404).send({message: 'canción no se ha eliminado'});
						}else{
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function cargarImagen(req, res) {
	var albumId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.imagen.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var extension_split = file_name.split('\.');
		var file_extension = extension_split[1];

		if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'gif') {
			Album.findByIdAndUpdate(albumId, {imagen: file_name}, (err, albumUpdated) =>{
				if(!albumUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el album'});
				}else{
					res.status(200).send({album: albumUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'El formato de la imagen no es válida'})
		}

		console.log(extension_split);
	}else{
		res.status(200).send({message: 'No ha subido ninguna imagen'})
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albumes/'+imageFile;

	fs.exists(path_file, function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe imagen'})
		}
	});
}

module.exports = {
	getAlbum,
	guardarAlbum,
	getAlbumes,
	actualizarAlbum,
	borrarAlbum,
	cargarImagen,
	getImageFile
};