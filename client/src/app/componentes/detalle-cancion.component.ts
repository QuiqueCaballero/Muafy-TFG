import { Component, OnInit } from '@angular/core';
import { Album } from '../modelos/album';
import { Cancion } from '../modelos/cancion';
import { UsuarioService } from '../servicios/usuario.service';
import { AlbumService } from '../servicios/album.service';
import { CancionService } from '../servicios/cancion.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'detalle-cancion',
	templateUrl: '../views/detalle-cancion.html',
	providers: [UsuarioService, AlbumService, CancionService]
})

export class DetalleCancionComponent implements OnInit{
	public album: Album;
	public cancion: Cancion;
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
		console.log('Componente detalle cancion OK');
		this.getCancion();

	}

	getCancion(){
		console.log('funciona!');
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

}