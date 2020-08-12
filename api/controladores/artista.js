'use strict'

//exportar modulo de paginacion en la lista de artistas
var mongoosePaginate = require('mongoose-pagination');
//exportar modulos para trabajar con sistemas de ficheros
var path = require('path');
var fs = require('fs');
//exportar modelos de la API que se van a utilizar
var Artista = require('../modelos/artista');
var Cancion = require('../modelos/cancion');
var Album = require('../modelos/album');

//metodo para sacar un artista de la base de datos
function getArtista(req, res){
	//variables
	//recoge el parametro id que llega por la url
	var artistaId = req.params.id;
	//metodo find para sacar el artista
	Artista.findById(artistaId, (err, artist) => {
		//error 500 en la peticion
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			//en caso de conseguir los datos de la peticion
			//comprobar si nos llega correctamente el artista
			//error 404 el artista no existe
			//si existe nos envia el objeto artista
			if (!artist) {
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}

function guardarArtista(req, res){
	var artista = new Artista();

	var parametros = req.body;

	artista.nombre = parametros.nombre;
	artista.descripcion = parametros.descripcion;
	artista.imagen = 'null';

	artista.save((err, artistaStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistaStored){
				res.status(404).send({message: 'No se ha guardado el artista'});
			}else{
				res.status(200).send({artist: artistaStored});
			}
		}
	});
}

function getArtistas(req, res){
	
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 5;

	Artista.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!artists) {
				res.status(404).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}

function actualizarArtista(req, res){
	var artistaId = req.params.id;
	var update = req.body;

	Artista.findByIdAndUpdate(artistaId, update, (err, artistaUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error al guardar artista'});
		}else{
			if (!artistaUpdated) {
				res.status(404).send({message: 'artista no actualizado'});
			}else{
				res.status(200).send({artist: artistaUpdated});
			}
		}
	});
}

function borrarArtista(req, res){
	var artistaId = req.params.id;
	Artista.findByIdAndRemove(artistaId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error al eliminar artista'});
		}else{
			if (!artistRemoved) {
				res.status(404).send({message: 'artista no se ha eliminado'});
			}else{
				
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
					if (err) {
						res.status(500).send({message: 'Error al eliminar album'});
					}else{
						if (!albumRemoved) {
							res.status(404).send({message: 'album no se ha eliminado'});
						}else{
							Cancion.find({album: albumRemoved._id}).remove((err, cancionRemoved) =>{
								if (err) {
									res.status(500).send({message: 'Error al eliminar canción'});
								}else{
									if (!cancionRemoved) {
										res.status(404).send({message: 'canción no se ha eliminado'});
									}else{
										res.status(200).send({artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function cargarImagen(req, res) {
	var artistaId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.imagen.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var extension_split = file_name.split('\.');
		var file_extension = extension_split[1];

		if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'gif') {
			Artista.findByIdAndUpdate(artistaId, {imagen: file_name}, (err, artistaUpdated) =>{
				if(!artistaUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistaUpdated});
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
	var path_file = './uploads/artistas/'+imageFile;

	fs.exists(path_file, function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe imagen'})
		}
	});
}


module.exports = {
	getArtista,
	guardarArtista,
	getArtistas,
	actualizarArtista,
	borrarArtista,
	cargarImagen,
	getImageFile
};