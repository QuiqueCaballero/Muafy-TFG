import { Component, OnInit } from '@angular/core';
import { Cancion } from '../modelos/cancion';
import { UsuarioService } from '../servicios/usuario.service';
import { CancionService } from '../servicios/cancion.service';
import { UploadService } from '../servicios/upload.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'editar-cancion',
	templateUrl: '../views/cancion-add.html',
	providers: [UsuarioService, CancionService, UploadService]
})

export class EditarCancionComponent implements OnInit{
	public titulo: string;
	public cancion: Cancion;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _cancionService: CancionService, private _uploadService: UploadService){
		this.titulo = 'Editar cancion';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.cancion = new Cancion(1, '', '', '', '');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('Componente editar canción OK');
		this.getCancion();
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._cancionService.editarCancion(this.token, id, this.cancion).subscribe(
				response => {
			
					if(!response.cancion){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'La canción se ha actualizado correctamente';

						if(!this.filesToUpload){
							this._router.navigate(['/album', response.cancion.album]);
						}else{

							this._uploadService.makeFileRequest(this.url+'cargar-fichero-cancion/'+id, [], this.filesToUpload, this.token, 'fichero').then(
								(result) => {
									this._router.navigate(['/album', response.cancion.album]);
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

	getCancion(){
		this._route.params.forEach((params: Params) => {

			let id = params['id'];
			this._cancionService.getCancion(this.token, id).subscribe(
				response => {
			
					if(!response.cancion){
						this._router.navigate(['/']);
					}else{
						this.cancion = response.cancion;
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


	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}