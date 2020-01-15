import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { IconLayer } from '@deck.gl/layers';

const sourceData = './dokart.json';

const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 32, height: 32, mask: true}
  };

const scatterplot = () => new ScatterplotLayer({
    id: 'toiletView',
    data: sourceData,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 21,
    radiusMaxPixels: 26,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => d.pris > 10 ? [200, 0, 40, 150] : d.pris == 'NULL' ? [138, 255, 119] : [255, 140, 0, 100],
    pickable: true,
    onHover: ({object, x, y}) => {
        const el = document.getElementById('tooltip');
        if (object) {
          const { id, adresse, pris, tid_hverdag, tid_lordag, tid_sondag } = object;
          el.innerHTML = `<h3>${adresse}</h3>
          <ul>
          <li>Pris: ${pris == 'NULL' ? 'Gratis' : pris}</li>
          <li>Åpningstid kvardag: ${tid_hverdag == 'ALL' && tid_hverdag ? 'Døgnåpent' : tid_hverdag}</li>
          <li>Åpningstid laurdag: ${tid_lordag == 'NULL' && tid_lordag ? 'Stengt' : tid_lordag}</li>
          <li>Åpningstid sundag: ${tid_sondag  == 'NULL' && tid_sondag ? 'Stengt' : tid_sondag}</li>
          </ul>`;
          el.style.display = 'block';
          el.style.opacity = 0.9;
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } else {
          el.style.opacity = 0.0;
        }
    } 
});

const hexagon = () => new HexagonLayer({
  id: 'hex',
  data: sourceData,
  getPosition: d => [d.longitude, d.latitude],
  getElevationWeight: d => (d.pris * 2),
  elevationScale: 3,
  extruded: true,
  radius: 150,         
  opacity: 0.6,        
  coverage: 0.88,
  lowerPercentile: 50
});


window.initMap = () => {

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 60.39, lng: 5.32 },
        zoom: 15,
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#181818"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1b1b1b"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2c2c2c"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8a8a8a"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#373737"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3c3c3c"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#4e4e4e"
                }
              ]
            },
            {
              "featureType": "road.local",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3d3d3d"
                }
              ]
            }
          ]
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            hexagon()
        ],
    });

    overlay.setMap(map);
}