import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarUsuarioComponent } from './componentes/editar-usuario.component';
import { ArtistaListaComponent } from './componentes/lista-artista.component';
import { HomeComponent } from './componentes/home.component';
import { ArtistaAddComponent } from './componentes/artista-add.component';
import { EditarArtistaComponent } from './componentes/editar-artista.component';
import { DetalleArtistaComponent } from './componentes/detalle-artista.component';
import { AlbumAddComponent } from './componentes/album-add.component';
import { EditarAlbumComponent } from './componentes/editar-album.component';
import { DetalleAlbumComponent } from './componentes/detalle-album.component';
import { CancionAddComponent } from './componentes/cancion-add.component';
import { EditarCancionComponent } from './componentes/editar-cancion.component';
import { DetalleCancionComponent } from './componentes/detalle-cancion.component';

const appRoutes: Routes = [

	{path: '', component: HomeComponent},
	{path: 'mi-cuenta', component: EditarUsuarioComponent},
	{path: 'artistas/:page', component: ArtistaListaComponent},
	{path: 'crear-artista', component: ArtistaAddComponent},
	{path: 'editar-artista/:id', component: EditarArtistaComponent},
	{path: 'artista/:id', component: DetalleArtistaComponent},
	{path: 'crear-album/:artista', component: AlbumAddComponent},
	{path: 'editar-album/:id', component: EditarAlbumComponent},
	{path: 'album/:id', component: DetalleAlbumComponent},
	{path: 'crear-cancion/:album', component: CancionAddComponent},
	{path: 'editar-cancion/:id', component: EditarCancionComponent},
	{path: 'cancion/:id', component: DetalleCancionComponent},
	{path: '**', component: HomeComponent}

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
