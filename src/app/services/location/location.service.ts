import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Location } from 'src/app/models/location';
import { uuid } from 'src/app/shared/utils';
import { ModalService } from '../modal/modal.service';
import { DragEndEvent, Marker } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private STORAGE_KEY = '_locations';
  private location = new Subject<Location>();
  private _locations: Location[] = [];
  private locations = new BehaviorSubject<Location[]>([]);
  location$ = this.location.asObservable();
  locations$ = this.locations.asObservable();
  constructor(private modalService: ModalService) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.locations.next(JSON.parse(data));
    }
    this.locations$.subscribe((locations) => {
      this._locations = locations;
      this.save();
    });
  }
  newLocation(lat?: number, lng?: number) {
    const location: Location = {
      id: uuid(),
      name: '',
      description: '',
      lat: lat || null,
      lng: lng || null,
      type: null,
      logo: null,
    };
    this.modalService.open();
    this.location.next(location);
  }
  editLocation(location: Location) {
    this.modalService.open();
    this.location.next(location);
  }
  removeLocation(location: Location) {
    const index = this._locations.findIndex((l) => l.id === location.id);
    if (index !== -1) {
      this._locations.splice(index, 1);
      this.locations.next(this._locations);
    }
  }

  saveLocation(location: Location) {
    const index = this._locations.findIndex((l) => l.id === location.id);
    if (index !== -1) {
      this._locations[index] = location;
    } else {
      this._locations.push(location);
    }
    this.locations.next(this._locations);
  }

  getLocation(id: string) {
    return this._locations.find((l) => l.id === id);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._locations));
  }
}
