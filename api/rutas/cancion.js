'use strict'

var express = require('express');
var CancionController = require('../controladores/cancion');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/canciones'});

api.get('/cancion/:id', md_auth.ensureAuth, CancionController.getCancion);
api.get('/canciones/:album?', md_auth.ensureAuth, CancionController.getCanciones);
api.post('/cancion', md_auth.ensureAuth, CancionController.guardarCancion);
api.put('/cancion/:id', md_auth.ensureAuth, CancionController.actualizarCancion);
api.delete('/cancion/:id', md_auth.ensureAuth, CancionController.borrarCancion);
api.post('/cargar-fichero-cancion/:id', [md_auth.ensureAuth, md_upload], CancionController.cargarFichero);
api.get('/get-fichero-cancion/:cancionFile', CancionController.getCancionFile);

module.exports = api;