'use strict'

var express = require('express');
var UsuarioController = require('../controladores/usuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/usuarios'});

api.get('/probando-controlador', md_auth.ensureAuth, UsuarioController.pruebas);
api.post('/registrar', UsuarioController.guardarUsuario);
api.post('/login', UsuarioController.loginUsuario);
api.put('/actualizar-usuario/:id', md_auth.ensureAuth, UsuarioController.actualizarUsuario);
api.post('/cargar-imagen-usuario/:id', [md_auth.ensureAuth, md_upload], UsuarioController.cargarImagen);
api.get('/get-imagen-usuario/:imageFile', UsuarioController.getImageFile);

module.exports = api;
