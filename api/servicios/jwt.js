'use strict'

//importar modulos
var jwt = require('jwt-simple');
//modulo para gestionar fecha de creacion y expiracion del token
var moment = require('moment');
var secret = 'clave_secreta_tfg';

//metodo para crear y exportar el token
//le pasamos en la funcion el objeto usuario
//este metodo va a coger todos sus datos 
//y lo va a guardar dentro de un token codificado
exports.createToken = function(user){
	var payload = {
		//propiedades
		sub: user._id,
		nombre: user.nombre,
		apellidos: user.apellidos,
		email: user.email,
		rol: user.rol,
		imagen: user.imagen,
		//fecha creacion
		//formato unix para comparar ambas fechas
		iat: moment().unix(),
		//fecha de expiracion
		//expira cada 30 dias
		exp: moment().add(30, 'days').unix
	};

	//devuelve el token codificado
	//pasamos clave secreta para que genere la codificacion del token
	return jwt.encode(payload, secret);
};