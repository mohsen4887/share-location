import { Component, Input, OnInit } from '@angular/core';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input() locationid = '';
  location!: Location;
  private _locations: Location[] = [];
  constructor(private locationService: LocationService) {}
  ngOnInit(): void {
    this.locationService.locations$.subscribe((locations) => {
      this._locations = locations;
      const location = locations.find((l) => l.id === this.locationid);
      if (location) {
        this.location = location;
      }
    });
  }

  edit() {
    this.locationService.editLocation(this.location);
  }
  remove() {
    this.locationService.removeLocation(this.location);
  }
}
