import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { styles } from './styles';

const sourceData = './dokart.json';

const positionData = [
  {
    "id": 20,
    "latitude": 60.3963703,
    "longitude": 5.3242669,
    "cleanliness": 1
 },
 {
  "id": 1,
  "latitude": 60.3879681,
  "longitude": 5.334608,
  "cleanliness": 1
},

]

/* Second assignment */
const emergencyNow = () => new LineLayer({
    id: 'line-layer',
    data: positionData,
    getWidth: 10,
    getSourcePosition: d => [positionData[0].longitude, positionData[0].latitude],
    getTargetPosition: d => [positionData[1].longitude, positionData[1].latitude],
    getColor: d => [200, 0, 40, 150],
    pickable: true,
    onHover: ({object, x, y}) => {
      const el = document.getElementById('tooltip');
      if (object) {
        const { id, adresse, cleanliness } = object;
        el.innerHTML = `<h3>${adresse}</h3>`
      }
  }
});

/* First assignment: add a filter based on best rating */
const ratingoverlay = () => new ScatterplotLayer({
  id: 'ratingLayer',
  data: sourceData,
  opacity: 0.8,
  filled: true,
  radiusMinPixels: 10,
  radiusMaxPixels: 16,
  getPosition: d => [d.longitude, d.latitude],
  getFillColor: d => d.cleanliness === 0 ? [200, 0, 40, 150] : d.cleanliness === 1 ? [138, 255, 119] : [255, 140, 0, 100],
  pickable: true,
  onHover: ({object, x, y}) => {
      const el = document.getElementById('tooltip');
      if (object) {
        const { id, adresse, cleanliness } = object;
        el.innerHTML = `<h3>${adresse}</h3>
        <section>
          <p>${cleanliness === 0 ? 'Styr unna med mindre du virkelig må på do!' : cleanliness === 2 ? 'heilt ok' : 'Her kan du trygt gå!' }</p>
        </section>`;
        el.style.display = 'block';
        el.style.opacity = 0.9;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      } else {
        el.style.opacity = 0.0;
      }
  }
});


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
  elevationScale: 2,
  extruded: true,
  radius: 150,
  opacity: 0.6,
  coverage: 0.88,
  lowerPercentile: 50
});

const selectedView = () => {
  var header = document.getElementById("control-panel");
  var btns = header.getElementsByClassName("button");

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    });
  }
}


window.initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 60.39, lng: 5.32 },
        zoom: 15,
        styles: styles
    });

    const overlay = new GoogleMapsOverlay({
      layers: [
        scatterplot()
      ],
    });

    selectedView();
    overlay.setMap(map);

    window.setPriceOverview = () => {
      overlay.setProps({
        layers: [
            scatterplot()
        ],
      });
    }

    window.setHeatMap = () => {
      overlay.setProps({
        layers: [
          hexagon(),
          scatterplot()
        ]
      })
    }

    /* First assignment: add a filter based on best rating */
    window.setCleanlinessRating = () => {
      overlay.setProps({
        layers: [
          ratingoverlay()
        ]
      })
    }

    /* Second assignment */
    window.emergencyNow = () => {
      overlay.setProps({
        layers: [
          emergencyNow()
        ]
      })
    }

    window.resetViews = () => {
      overlay.setProps({
        layers: []
      })
    }
}
