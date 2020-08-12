import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { Album } from '../modelos/album';
import { UsuarioService } from '../servicios/usuario.service';
import { ArtistaService } from '../servicios/artista.service';
import { AlbumService } from '../servicios/album.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UsuarioService, ArtistaService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
	public title: string;
	public artista: Artista;
	public album: Album;
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _artistaService: ArtistaService, private _albumService: AlbumService){
		this.title = 'Crear album';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2017, '', '');
	}

	ngOnInit(){
		console.log('Componente añadir album OK');
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let artista_id = params['artista'];
			this.album.artista = artista_id;

			this._albumService.addAlbum(this.token, this.album).subscribe(
				response => {
			
					if(!response.album){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.album = response.album;
						this.alertMessage = 'El album se ha creado correctamente';

						this._router.navigate(['/editar-album', response.album._id]);
					}
				},
				error => {
					var errorMessage = <any>error;

		  			if (errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				this.alertMessage= body.message;
		  				console.log(error);
		  			} 
				}
			);
		});
	}
}