'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var puerto = process.env.PORT || 3977;


mongoose.connect('mongodb://localhost:27017/tfg', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("La base de datos está en funcionamiento.");

		app.listen(puerto, function(){
			console.log("Servidor de API Rest escuchando en http://localhost:"+puerto);
		})
	}
});