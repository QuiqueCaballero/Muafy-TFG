import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { Album } from '../modelos/album';
import { UsuarioService } from '../servicios/usuario.service';
import { AlbumService } from '../servicios/album.service';
import { UploadService } from '../servicios/upload.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'editar-album',
	templateUrl: '../views/album-add.html',
	providers: [UsuarioService, AlbumService, UploadService]
})

export class EditarAlbumComponent implements OnInit{
	public title: string;
	public album: Album;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _albumService: AlbumService, private _uploadService: UploadService){
		this.title = 'Editar album';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2017, '', '');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('Componente añadir album OK');

		this.getAlbum();
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.editarAlbum(this.token, id, this.album).subscribe(
				response => {
			
					if(!response.album){
						this.alertMessage = 'Error en el servidor';
					}else{
						
						this.alertMessage = 'El album se ha actualizado correctamente';

						if(!this.filesToUpload){
							this._router.navigate(['/artista', response.album.artista]);
						}else{
							this._uploadService.makeFileRequest(this.url+'cargar-imagen-album/'+id, [], this.filesToUpload, this.token, 'imagen').then(
								(result) => {
									this._router.navigate(['/artista', response.album.artista]);
								},
								(error) => {
									console.log(error);
								}
							);
						}
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

	getAlbum(){
		this._route.params.forEach((params: Params) => {

			let id = params['id'];
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
			
					if(!response.album){
						this._router.navigate(['/']);
					}else{
						this.album = response.album;
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

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}