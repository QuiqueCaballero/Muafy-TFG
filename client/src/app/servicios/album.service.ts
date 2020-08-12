import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../modelos/album';

@Injectable()
export class AlbumService{

	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addAlbum(token, album: Album){
		let params = JSON.stringify(album);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.post(this.url+'album', params, {headers: headers}).map(res => res.json());
	}

	getAlbum(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.get(this.url+'album/'+id, options).map(res => res.json());
	}

	editarAlbum(token, id: string, album: Album){
		let params = JSON.stringify(album);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.put(this.url+'album/'+id, params, {headers: headers}).map(res => res.json());
	}

	getAlbums(token, artistaId = null){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });

		if(artistaId == null){
			return this._http.get(this.url+'albumes', options).map(res => res.json());
		}else{
			return this._http.get(this.url+'albumes/'+artistaId, options).map(res => res.json());
		}
		
	}

	elimiarAlbum(token, id: string){

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({ headers: headers });
		return this._http.delete(this.url+'album/'+id, options).map(res => res.json());
	}

}