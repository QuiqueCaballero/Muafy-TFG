import { Component, OnInit } from '@angular/core';
import { Usuario } from './modelos/usuario';
import { UsuarioService } from './servicios/usuario.service';
import { GLOBAL } from './servicios/global';
import { Router, ActivatedRoute, Params } from '@angular/router'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UsuarioService]
})
export class AppComponent implements OnInit{
  public title = 'muafy';
  public usuario: Usuario;
  public usuario_registro: Usuario;
  public identity;
  public token;
  public errorMessage;
  public alertRegistro;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService){
  	this.usuario = new Usuario('','','','','','ROLE_USER','');
  	this.usuario_registro = new Usuario('','','','','','ROLE_USER','');
  	this.url = GLOBAL.url;
  }

  ngOnInit(){
  	this.identity = this._usuarioService.getIdentity();
  	this.token = this._usuarioService.getToken();

  	console.log(this.identity);
  	console.log(this.token);
  }

  logout(){
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
  	localStorage.clear();

  	this.identity = null;
  	this.token = null;
  	this._router.navigate(['/']);
  }

  public onSubmit(){
  	console.log(this.usuario);

  	this._usuarioService.signup(this.usuario).subscribe(
  		response => {
  			let identity = response.user;
  			this.identity = identity;

  			if(!this.identity._id){
  				alert("El usuario no se identificó correctamente");
  			}else{

  				localStorage.setItem('identity', JSON.stringify(identity));

				this._usuarioService.signup(this.usuario, 'true').subscribe(
			  		response => {
			  			let token = response.token;
			  			this.token = token;

			  			if(this.token.length <= 0){
			  				alert("El token no se ha generado correctamente");
			  			}else{

			  				localStorage.setItem('token', token);
			  				this.usuario = new Usuario('','','','','','ROLE_USER','');
			  			}
			  		},
			  		error => {
			  			var errorMessage = <any>error;

			  			if (errorMessage != null){
			  				var body = JSON.parse(error._body);
			  				this.errorMessage= body.message;
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
  				this.errorMessage= body.message;
  				console.log(error);
  			} 
  		}
  	);
  }


  onSubmitRegistro(){
  	console.log(this.usuario_registro);

  	this._usuarioService.registro(this.usuario_registro).subscribe(
  		response => {
			let usuario = response.user;
			this.usuario_registro = usuario;

			if(!usuario._id){
  				this.alertRegistro = 'Error al registrarse';
  			}else{
  				this.alertRegistro = 'El registro se completó correctamente, identificate con '+this.usuario_registro.email;
  				this.usuario_registro = new Usuario('','','','','','ROLE_USER','');
  			}
		
		},
		error => {
			var errorMessage = <any>error;

			if (errorMessage != null){
				var body = JSON.parse(error._body);
				this.alertRegistro= body.message;
				console.log(error);
			} 
		}
  	);
  }


}
