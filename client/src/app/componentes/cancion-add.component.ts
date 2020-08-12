import { Component, OnInit } from '@angular/core';
import { Cancion } from '../modelos/cancion';
import { UsuarioService } from '../servicios/usuario.service';
import { CancionService } from '../servicios/cancion.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'cancion-add',
	templateUrl: '../views/cancion-add.html',
	providers: [UsuarioService, CancionService]
})

export class CancionAddComponent implements OnInit{
	public titulo: string;
	public cancion: Cancion;
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _cancionService: CancionService){
		this.titulo = 'Crear cancion';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.cancion = new Cancion(1, '', '', '', '');
	}

	ngOnInit(){
		console.log('Componente añadir canción OK');
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let album_id = params['album'];
			this.cancion.album = album_id;
			console.log(this.cancion);

			this._cancionService.addCancion(this.token, this.cancion).subscribe(
				response => {
			
					if(!response.cancion){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.cancion = response.cancion;
						this.alertMessage = 'La canción se ha creado correctamente';

						this._router.navigate(['/editar-cancion', response.cancion._id]);
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