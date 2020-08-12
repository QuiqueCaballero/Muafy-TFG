import { Component, OnInit } from '@angular/core';
import { Album } from '../modelos/album';
import { Cancion } from '../modelos/cancion';
import { UsuarioService } from '../servicios/usuario.service';
import { AlbumService } from '../servicios/album.service';
import { CancionService } from '../servicios/cancion.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'detalle-album',
	templateUrl: '../views/detalle-album.html',
	providers: [UsuarioService, AlbumService, CancionService]
})

export class DetalleAlbumComponent implements OnInit{
	public album: Album;
	public canciones: Cancion[];
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _albumService: AlbumService, private _cancionService: CancionService){
		
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('Componente detalle album OK');
		this.getAlbum();

	}

	getAlbum(){
		console.log('funciona!');
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					
					if(!response.album){
						this._router.navigate(['/']);
					}else{
						this.album = response.album;

						this._cancionService.getCanciones(this.token, response.album._id).subscribe(
							response => {
								
								if(!response.canciones){
									this.alertMessage = 'Este album no tiene canciones';
								}else{
									this.canciones = response.canciones;
								}
							},
							error => {
								var errorMessage = <any>error;

					  			if (errorMessage != null){
					  				var body = JSON.parse(error._body);
					  				//this.alertMessage= body.message;
					  				console.log(error);
					  			} 
							}
						);
					}
				},
				error => {
					var errorMessage = <any>error;

		  			if (errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				//this.alertMessage= body.message;
		  				console.log(error);
		  			} 
				}
			);
		});
	}

	public confirmado;
	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelCancion(){
		this.confirmado = null;
	}

	onDeleteCancion(id){
		this._cancionService.elimiarCancion(this.token, id).subscribe(
			response => {

				if(!response.cancion){
					alert('Error en el servidor');
				}
				this.getAlbum();
				
			},
			error => {
				var errorMessage = <any>error;

	  			if (errorMessage != null){
	  				var body = JSON.parse(error._body);
	  				//this.alertMessage= body.message;
	  				console.log(error);
	  			} 
			}
		);
	}

	startPlayer(cancion){
		let song_player = JSON.stringify(cancion);
		let file_path = this.url + 'get-fichero-cancion/' +cancion.fichero;
		let image_path = this.url + 'get-imagen-album/' +cancion.album.imagen;

		localStorage.setItem('sound_song', song_player);
		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById('play-cancion-titulo').innerHTML = cancion.nombre;
		document.getElementById('play-cancion-artista').innerHTML = cancion.album.artista.nombre;
		document.getElementById('play-imagen-album').setAttribute("src", image_path);
	}

}