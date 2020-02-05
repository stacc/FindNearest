import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { styles } from './styles';

const sourceData = './dokart.json';

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

  window.resetViews = () => {
    overlay.setProps({
      layers: []
    })
  }
}
