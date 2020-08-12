import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { UsuarioService } from '../servicios/usuario.service';
import { ArtistaService } from '../servicios/artista.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'artista-add',
	templateUrl: '../views/artista-add.html',
	providers: [UsuarioService, ArtistaService]
})

export class ArtistaAddComponent implements OnInit{
	public titulo: string;
	public artista: Artista;
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _artistaService: ArtistaService){
		this.titulo = 'Crear Artista';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.artista = new Artista('','','');
	}

	ngOnInit(){
		console.log('Componente añadir artistas OK');

	}

	onSubmit(){
		console.log(this.artista);

		this._artistaService.addArtista(this.token, this.artista).subscribe(
			response => {
				

				if(!response.artist){
					this.alertMessage = 'Error en el servidor';
				}else{
					this.artista = response.artist;
					this.alertMessage = 'El artista se ha creado correctamente';
					this._router.navigate(['/editar-artista', response.artist._id]);
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
	}
}