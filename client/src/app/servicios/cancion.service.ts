import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Cancion } from '../modelos/cancion';

@Injectable()
export class CancionService{

	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addCancion(token, cancion: Cancion){
		let params = JSON.stringify(cancion);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.post(this.url+'cancion', params, {headers: headers}).map(res => res.json());
	}

	getCancion(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.get(this.url+'cancion/'+id, options).map(res => res.json());
	}

	editarCancion(token, id: string, cancion: Cancion){
		let params = JSON.stringify(cancion);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.put(this.url+'cancion/'+id, params, {headers: headers}).map(res => res.json());
	}

	getCanciones(token, albumId = null){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });

		if(albumId == null){
			return this._http.get(this.url+'canciones', options).map(res => res.json());
		}else{
			return this._http.get(this.url+'canciones/'+albumId, options).map(res => res.json());
		}
		
	}

	elimiarCancion(token, id: string){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.delete(this.url+'cancion/'+id, options).map(res => res.json());
	}

}