import { Component, OnDestroy } from '@angular/core';
import { DragEndEvent, latLng, Layer, LeafletMouseEvent, point } from 'leaflet';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location/location.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { marker } from 'src/app/directives/leaflet/utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnDestroy {
  locations: Location[] = [];
  layers: Layer[] = [];
  subs: Subscription[] = [];
  constructor(private locationService: LocationService) {
    const sub = this.locationService.locations$.subscribe((locations) => {
      this.locations = locations;
      this.layers = this.locations.map((l) => {
        return marker(latLng(l.lat!, l.lng!), false, l);
      });
    });
    this.subs.push(sub);
  }

  addLocation(lat?: number, lng?: number) {
    this.locationService.newLocation(lat, lng);
  }
  onMapClick(e: LeafletMouseEvent) {
    this.addLocation(e.latlng.lat, e.latlng.lng);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
