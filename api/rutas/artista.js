'use strict'

var express = require('express');
var ArtistaController = require('../controladores/artista');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/artistas'});

api.get('/artista/:id', md_auth.ensureAuth, ArtistaController.getArtista);
api.get('/artistas/:page?', md_auth.ensureAuth, ArtistaController.getArtistas);
api.post('/artista', md_auth.ensureAuth, ArtistaController.guardarArtista);
api.put('/artista/:id', md_auth.ensureAuth, ArtistaController.actualizarArtista);
api.delete('/artista/:id', md_auth.ensureAuth, ArtistaController.borrarArtista);
api.post('/cargar-imagen-artista/:id', [md_auth.ensureAuth, md_upload], ArtistaController.cargarImagen);
api.get('/get-imagen-artista/:imageFile', ArtistaController.getImageFile);

module.exports = api;