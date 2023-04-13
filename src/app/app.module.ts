import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LeafletDirective } from './directives/leaflet/leaflet.directive';
import { FormComponent } from './components/form/form.component';
import { MapComponent } from './components/map/map.component';

import { createCustomElement } from '@angular/elements';
import { PopupComponent } from './components/popup/popup.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';

//comment
//comment
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LeafletDirective,
    FormComponent,
    PopupComponent,
    ModalComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const customElement = createCustomElement(PopupComponent, { injector });
    customElements.define('app-popup', customElement);
  }
}
