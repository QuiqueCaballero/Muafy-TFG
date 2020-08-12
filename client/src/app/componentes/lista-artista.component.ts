import { Component, OnInit } from '@angular/core';
import { Artista } from '../modelos/artista';
import { UsuarioService } from '../servicios/usuario.service';
import { ArtistaService } from '../servicios/artista.service';
import { GLOBAL } from '../servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'lista-artista',
	templateUrl: '../views/lista-artista.html',
	providers: [UsuarioService, ArtistaService]
})

export class ArtistaListaComponent implements OnInit{
	public titulo: string;
	public artistas: Artista[];
	public identity;
	public token;
	//public alertMessage;
	public url: string;
	public next_page;
	public prev_page;

	constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService, private _artistaService: ArtistaService){
		this.titulo = 'Artistas';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit(){
		console.log('Componente Listado de Artistas OK');
		this.getArtistas();
	}

	getArtistas(){
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page){
				page = 1;
			}else{
				this.next_page = page+1;
				this.prev_page = page-1;

				if(this.prev_page == 0){
					this.prev_page = 1;
				}
			}

			this._artistaService.getArtistas(this.token, page).subscribe(
				response => {

					if(!response.artists){
						this._router.navigate(['/']);
					}else{
						this.artistas = response.artists;
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

	onCancelArtista(){
		this.confirmado = null;
	}

	onDeleteArtista(id){
		this._artistaService.elimiarArtista(this.token, id).subscribe(
			response => {

				if(!response.artists){
					alert('Error en el servidor');
				}
				this.getArtistas();
				
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