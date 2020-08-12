import { Component, OnInit } from '@angular/core';
import { Cancion } from '../modelos/cancion';
import { GLOBAL } from '../servicios/global';

@Component({
	selector: 'player',
	template: `
	<div class="album-imagen">
		<span *ngIf="cancion.album">
			<img id="play-imagen-album" src="{{ url + 'get-imagen-album/' + cancion.album.imagen}}" />
		</span>
		<span *ngIf="!cancion.album">
			<img id="play-imagen-album" src="assets/imagenes/default.jpg" />
		</span>
	</div>

	<div class="audio-file">
		<p>Reproduciendo</p>
		<span id="play-cancion-titulo">{{cancion.nombre}}</span>
		|
		<span id="play-cancion-artista">
			<span *ngIf="cancion.album.artista">
				{{cancion.album.artista.nombre}}
			</span>
		</span>
		<audio controls id="player">
			<source id="mp3-source" src="{{ url + 'get-fichero-cancion/' + cancion.fichero}}" type="audio/mpeg" />
			Tu navegador no es compatible
		</audio>
	</div>
	`
		
})

export class PlayerComponent implements OnInit{
	public url: string;
	public cancion;

	constructor(){
		this.url = GLOBAL.url;
		this.cancion = new Cancion(1, '', '', '', '');
	}

	ngOnInit(){
		console.log('Componente player OK');

		var cancion = JSON.parse(localStorage.getItem('sound_song'));
		if(cancion){
			this.cancion = cancion;
		}else{
			this.cancion = new Cancion(1, '', '', '', '');
		}

	}
}