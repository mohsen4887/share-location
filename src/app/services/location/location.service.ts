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
  private _data: Location[] = [];

  private _selectedLocation = new Subject<Location>();
  private _locations = new BehaviorSubject<Location[]>([]);

  public get selectedLocation() {
    return this._selectedLocation.asObservable();
  }

  public get locations() {
    return this._locations.asObservable();
  }

  constructor(private modalService: ModalService) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this._data = JSON.parse(data);
      this._locations.next(this._data);
    }
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
    this._selectedLocation.next(location);
  }
  editLocation(location: Location) {
    this.modalService.open();
    this._selectedLocation.next(location);
  }
  removeLocation(location: Location) {
    const index = this._data.findIndex((l) => l.id === location.id);
    if (index !== -1) {
      this._data.splice(index, 1);
      this.save();
      this._locations.next(this._data);
    }
  }

  saveLocation(location: Location) {
    const index = this._data.findIndex((l) => l.id === location.id);
    if (index !== -1) {
      this._data[index] = location;
    } else {
      this._data.push(location);
    }
    this.save();
    this._locations.next(this._data);
  }

  getLocation(id: string) {
    return this._data.find((l) => l.id === id);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._data));
  }
}
