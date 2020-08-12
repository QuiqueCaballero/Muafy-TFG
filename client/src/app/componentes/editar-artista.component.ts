import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { UsuarioService } from '../servicios/usuario.service';
import { ArtistaService } from '../servicios/artista.service';
import { UploadService } from '../servicios/upload.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'editar-artista',
	templateUrl: '../views/artista-add.html',
	providers: [UsuarioService, ArtistaService, UploadService]
})

export class EditarArtistaComponent implements OnInit{
	public titulo: string;
	public artista: Artista;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _artistaService: ArtistaService, private _uploadService: UploadService){
		this.titulo = 'Editar artista';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.artista = new Artista('','','');
		this.is_edit = true;
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

	onSubmit(){
		console.log(this.artista);

		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistaService.editarArtista(this.token, id, this.artista).subscribe(
				response => {
					
					if(!response.artist){
						this.alertMessage = 'Error en el servidor';
					}else{
			
						this.alertMessage = 'El artista se ha actualizado correctamente';

						if(!this.filesToUpload){
							this._router.navigate(['/artista', response.artist._id]);
						}else{

							this._uploadService.makeFileRequest(this.url+'cargar-imagen-artista/'+id, [], this.filesToUpload, this.token, 'imagen').then(
								(result) => {
									this._router.navigate(['/artista', response.artist._id]);
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

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}