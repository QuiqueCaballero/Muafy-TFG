'use strict'

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
	res.status(200).send({
		message: "probando accion controlador usuario"
	});
}

function guardarUsuario(req, res){
	var usuario = new Usuario();

	var parametros = req.body;

	console.log(parametros);

	usuario.nombre = parametros.nombre;
	usuario.apellidos = parametros.apellidos;
	usuario.email = parametros.email;
	usuario.rol = 'ROLE_USER';
	usuario.imagen = 'null';

	if(parametros.contrasenya){
		
		//encriptar contraseña y guardar
		bcrypt.hash(parametros.contrasenya, null, null, function(err, hash){
			usuario.contrasenya = hash;
			if(usuario.nombre != null && usuario.apellidos != null && usuario.email != null){
				//guardar usuario
				usuario.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Rellene todos los campos'});
			}
		});
	}else{
		res.status(200).send({message: 'Introduce contraseña'});
	}
}

function loginUsuario(req, res){
	var parametros = req.body;

	var email = parametros.email;
	var contrasenya = parametros.contrasenya;

	Usuario.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//comprobar la contraseña
				bcrypt.compare(contrasenya, user.contrasenya, function(err, check){
					if(check){
						//devolver datos del usuario loged
						if(parametros.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}

function actualizarUsuario(req, res){
	var usuarioId = req.params.id;
	var update = req.body;

	if (usuarioId != req.user.sub) {
		return res.status(500).send({message: 'No tienes permiso'});
	}

	Usuario.findByIdAndUpdate(usuarioId, update, (err, usuarioUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar usuario'});
		}else{
			if(!usuarioUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: usuarioUpdated});
			}
		}
	});
}

function cargarImagen(req, res) {
	var usuarioId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var extension_split = file_name.split('\.');
		var file_extension = extension_split[1];

		if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'gif') {
			Usuario.findByIdAndUpdate(usuarioId, {image: file_name}, (err, usuarioUpdated) =>{
				if(!usuarioUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: usuarioUpdated});
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
	var path_file = './uploads/usuarios/'+imageFile;

	fs.exists(path_file, function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe imagen'})
		}
	});
}


module.exports = {
	pruebas,
	guardarUsuario,
	loginUsuario,
	actualizarUsuario,
	cargarImagen,
	getImageFile
};