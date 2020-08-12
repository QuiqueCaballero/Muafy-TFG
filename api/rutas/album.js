'use strict'

var express = require('express');
var AlbumController = require('../controladores/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/albumes'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albumes/:artista?', md_auth.ensureAuth, AlbumController.getAlbumes);
api.post('/album', md_auth.ensureAuth, AlbumController.guardarAlbum);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.actualizarAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.borrarAlbum);
api.post('/cargar-imagen-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.cargarImagen);
api.get('/get-imagen-album/:imageFile', AlbumController.getImageFile);

module.exports = api;