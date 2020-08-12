import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { Album } from '../modelos/album';
import { UsuarioService } from '../servicios/usuario.service';
import { ArtistaService } from '../servicios/artista.service';
import { AlbumService } from '../servicios/album.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'detalle-artista',
	templateUrl: '../views/detalle-artista.html',
	providers: [UsuarioService, ArtistaService, AlbumService]
})

export class DetalleArtistaComponent implements OnInit{
	public artista: Artista;
	public albums: Album[];
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _artistaService: ArtistaService, private _albumService: AlbumService){
		
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('Componente editar artistas OK');
		this.getArtista();

	}

	getArtista(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistaService.getArtista(this.token, id).subscribe(
				response => {
					
					if(!response.artist){
						this._router.navigate(['/']);
					}else{
						this.artista = response.artist;

						this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response => {
								
								if(!response.albums){
									this.alertMessage = 'Este artista no tiene albumes';
								}else{
									this.albums = response.albums;
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

	onCancelAlbum(){
		this.confirmado = null;
	}

	onDeleteAlbum(id){
		this._albumService.elimiarAlbum(this.token, id).subscribe(
			response => {

				if(!response.album){
					alert('Error en el servidor');
				}
				this.getArtista();
				
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
}