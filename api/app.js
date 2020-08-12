'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// aqui se cargan las rutas
var usuario_rutas = require('./rutas/usuario');
var artista_rutas = require('./rutas/artista');
var album_rutas = require('./rutas/album');
var cancion_rutas = require('./rutas/cancion');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//aqui se configura las cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});
// las rutas base
app.use('/api', usuario_rutas);
app.use('/api', artista_rutas);
app.use('/api', album_rutas);
app.use('/api', cancion_rutas);

module.exports = app;