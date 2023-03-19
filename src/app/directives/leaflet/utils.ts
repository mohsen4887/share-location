import { LatLng, Marker, marker as leafletMarker, icon, point } from 'leaflet';
import { Location, LocationType } from 'src/app/models/location';

function getMarkerIcon(type?: LocationType) {
  let iconUrl = 'assets/leaflet/marker-icon.png';
  let iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
  switch (type) {
    case LocationType.BANK:
      iconUrl = 'assets/bank-marker.png';
      iconRetinaUrl = 'assets/bank-marker-2x.png';
      break;
    case LocationType.BAR:
      iconUrl = 'assets/bar-marker.png';
      iconRetinaUrl = 'assets/bar-marker-2x.png';
      break;
    case LocationType.BUSINESS:
      iconUrl = 'assets/business-marker.png';
      iconRetinaUrl = 'assets/business-marker-2x.png';
      break;
    case LocationType.GYM:
      iconUrl = 'assets/gym-marker.png';
      iconRetinaUrl = 'assets/gym-marker-2x.png';
      break;
    case LocationType.PARK:
      iconUrl = 'assets/park-marker.png';
      iconRetinaUrl = 'assets/park-marker-2x.png';
      break;

    default:
      iconUrl = 'assets/leaflet/marker-icon.png';
      iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
      break;
  }
  return icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: 'assets/leaflet/marker-shadow.png',
  });
}

export function marker(
  latLng: LatLng,
  draggable: boolean = false,
  location?: Location
): Marker<any> {
  const m = leafletMarker(latLng, {
    draggable,
    icon: getMarkerIcon(location?.type!),
  });
  if (location) {
    m.bindPopup(`<app-popup locationid="${location.id}"></app-popup>`, {
      offset: point(0, -30),
    });
  }

  return m;
}
