import { Component, OnInit } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { UsuarioService } from '../servicios/usuario.service';
import { GLOBAL } from '../servicios/global';

@Component({
  selector: 'editar-usuario',
  templateUrl: '../views/editar-usuario.html',
  providers: [UsuarioService]
})

export class EditarUsuarioComponent implements OnInit{

	public titulo: string;
	public usuario: Usuario;
	public identity;
	public token;
	public alertMessage;
	public filesToUpload: Array<File>;
	public url: string;
	
	constructor(private _usuarioService: UsuarioService){
		this.titulo = 'Actualizar datos';
		this.identity = this._usuarioService.getIdentity();
  		this.token = this._usuarioService.getToken();
		this.usuario = this.identity;
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('componente editar usuario OK')
	}

	onSubmit(){
		console.log(this.usuario);

		this._usuarioService.actualizarUsuario(this.usuario).subscribe(
			response => {
				if(!response.user){
					this.alertMessage = 'Usuario no actualizado';
				}else{
					//this.usuario = response.user;
					localStorage.setItem('identity', JSON.stringify(this.usuario));
					document.getElementById("identity_name").innerHTML = this.usuario.nombre;
					
					if(!this.filesToUpload){

					}else{
						this.makeFileRequest(this.url+'cargar-imagen-usuario/'+this.usuario._id, [], this.filesToUpload).then(
							(result: any) => {
								this.usuario.imagen = result.image;
								localStorage.setItem('identity', JSON.stringify(this.usuario));


								let image_path = this.url+'get-imagen-usuario/'+this.usuario.imagen;
								document.getElementById("image-logged").setAttribute('src', image_path);

								console.log(this.usuario);
							}
						);
					}

					this.alertMessage = 'Usuario actualizado correctamente';
				}
			},
			error => {
	  			var errorMessage = <any>error;

	  			if (errorMessage != null){
	  				var body = JSON.parse(error._body);
	  				this.alertMessage = body.message;
	  				console.log(error);
	  			} 
			}
		);

	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		var token = this.token;
		return new Promise(function(resolve, reject){
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i = 0; i < files.length; i++){
				formData.append('image', files[i], files[i].name);
			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}