import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artista } from '../modelos/artista';

@Injectable()
export class ArtistaService{

	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addArtista(token, artista: Artista){
		let params = JSON.stringify(artista);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.post(this.url+'artista', params, {headers: headers}).map(res => res.json());
	}

	getArtistas(token, page){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.get(this.url+'artistas/'+page, options).map(res => res.json());
	}

	getArtista(token, id: string){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.get(this.url+'artista/'+id, options).map(res => res.json());
	}

	editarArtista(token, id: string, artista: Artista){
		let params = JSON.stringify(artista);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.put(this.url+'artista/'+id, params, {headers: headers}).map(res => res.json());
	}

	elimiarArtista(token, id: string){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.delete(this.url+'artista/'+id, options).map(res => res.json());
	}

}