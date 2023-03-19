import {
  Directive,
  ElementRef,
  NgZone,
  Input,
  Output,
  OnInit,
  EventEmitter,
  SimpleChange,
  IterableDiffer,
  IterableDiffers,
  DoCheck,
} from '@angular/core';
import {
  latLng,
  Map,
  map,
  MapOptions,
  tileLayer,
  LeafletMouseEvent,
  Marker,
  DragEndEvent,
  Layer,
  LatLng,
  featureGroup,
  point,
} from 'leaflet';

@Directive({
  selector: '[leaflet]',
})
export class LeafletDirective implements OnInit, DoCheck {
  map!: Map;
  layersDiffer!: IterableDiffer<Layer>;
  @Input() layers: Layer[] = [];
  private _center: LatLng = latLng(51.51, -0.12);

  @Input() set center(value: LatLng | null) {
    this._center = value || latLng(51.51, -0.12);
    this.updateCenter();
  }
  get center(): LatLng {
    return this._center;
  }
  @Input() options: MapOptions = {
    center: this.center,
    zoom: 13,
    layers: [
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ],
  };

  @Output('mapClick') onClick = new EventEmitter<LeafletMouseEvent>();
  @Output('markerDragEnd') onMarkerDragEnd = new EventEmitter<DragEndEvent>();

  constructor(
    private element: ElementRef,
    private differs: IterableDiffers,
    private zone: NgZone
  ) {
    this.layersDiffer = this.differs.find([]).create<Layer>();
  }
  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.map = map(this.element.nativeElement, this.options);
      this.map.on('click', (e) => {
        this.zone.run(() => {
          this.onClick.emit(e);
        });
      });
      this.map.setView(this._center);
    });
  }

  ngDoCheck() {
    this.updateLayers();
  }

  private updateLayers() {
    const map = this.map;
    if (null != this.map && null != this.layersDiffer) {
      const changes = this.layersDiffer.diff(this.layers);
      if (null != changes) {
        this.zone.runOutsideAngular(() => {
          changes.forEachRemovedItem((c) => {
            map.removeLayer(c.item);
          });
          const addedItems: Layer[] = [];
          changes.forEachAddedItem((c) => {
            map.addLayer(c.item);
            addedItems.push(c.item);
            if (this.onMarkerDragEnd.observed) {
              c.item.on('dragend', (e) => {
                this.zone.run(() => {
                  this.onMarkerDragEnd.emit(e);
                });
              });
            }
          });
          if (addedItems.length) {
            map.fitBounds(featureGroup(addedItems).getBounds(), {
              padding: point(50, 50),
            });
          }
        });
      }
    }
  }

  private updateCenter() {
    if (this.map) {
      this.zone.runOutsideAngular(() => {
        this.map.setView(this._center);
      });
    }
  }
}
