import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  DragEndEvent,
  LatLng,
  latLng,
  LeafletMouseEvent,
  Marker,
} from 'leaflet';
import { Subscription } from 'rxjs';
import { marker } from 'src/app/directives/leaflet/utils';
import { Location, LocationType, locationTypes } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location/location.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  @ViewChild('locationForm') locationForm!: NgForm;
  @ViewChild('logoFile') logoFile!: ElementRef<HTMLInputElement>;
  locationTypes: LocationType[] = locationTypes;
  imageError = '';
  location!: Location;
  center: LatLng | null = null;
  markers: Marker[] = [];
  subs: Subscription[] = [];

  constructor(
    private locationService: LocationService,
    private modalService: ModalService
  ) {
    this.subs.push(
      this.locationService.selectedLocation.subscribe((location) => {
        this.location = { ...location };
        const hasLocation = location.lat && location.lng;
        this.markers = hasLocation
          ? [marker(latLng(location.lat!, location.lng!), true)]
          : [];
        this.center = hasLocation ? latLng(location.lat!, location.lng!) : null;
      })
    );
  }
  resetForm() {
    if (this.locationForm) {
      this.locationForm.resetForm();
      this.logoFile.nativeElement.value = '';
      this.markers = [];
      this.center = null;
    }
  }
  handleSubmit() {
    this.locationService.saveLocation({ ...this.location });
    this.resetForm();
    this.closeModal();
  }
  setLocation(event: LeafletMouseEvent) {
    this.location.lat = event.latlng.lat;
    this.location.lng = event.latlng.lng;
    this.center = event.latlng;
    this.markers = [marker(event.latlng, true)];
  }
  updateLocation(event: DragEndEvent) {
    const target = event.target as Marker;
    const latlng = target.getLatLng();
    this.location.lat = latlng.lat;
    this.location.lng = latlng.lng;
  }
  logoChange(event: Event): void {
    this.imageError = '';
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const max_size = 51200;
      if (target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1024 + 'KB';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          const imgBase64Path = e.target.result;
          this.location.logo = imgBase64Path;
        };
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  closeModal() {
    this.modalService.close();
  }

  removeImage() {
    this.location.logo = null;
    this.logoFile.nativeElement.value = '';
    this.imageError = '';
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
