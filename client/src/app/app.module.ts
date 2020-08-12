import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
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
import { PlayerComponent } from './componentes/player.component';
import { DetalleCancionComponent } from './componentes/detalle-cancion.component';


@NgModule({
  declarations: [
    AppComponent,
    EditarUsuarioComponent,
    ArtistaListaComponent,
    HomeComponent,
    ArtistaAddComponent,
    EditarArtistaComponent,
    DetalleArtistaComponent,
    AlbumAddComponent,
    EditarAlbumComponent,
    DetalleAlbumComponent,
    CancionAddComponent,
    EditarCancionComponent,
    PlayerComponent,
    DetalleCancionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
