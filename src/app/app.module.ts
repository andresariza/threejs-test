import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ThreejsSceneComponent} from './components/threejs-scene/threejs-scene.component';
import {ThreejsViewerComponent} from './components/threejs-viewer/threejs-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreejsSceneComponent,
    ThreejsViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
