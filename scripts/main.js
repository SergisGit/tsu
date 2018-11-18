(function () {
  'use strict';

  if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
    document
      .querySelector('html')
      .classList
      .add('is-ios');
  }

  var mapZoom = window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
  var mamCenter = window.matchMedia("(min-width: 768px)").matches ? [22.04622630078105,39.94769520495493] : [49.256614484375056,44.755914715920284];

  var flyToPoint = function(currentFeature, map) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: mapZoom
    });
  };

  mapboxgl.accessToken = 'pk.eyJ1IjoiaXNzZXJnIiwiYSI6ImNqbWJ1MG4xZzA3YXUzd21pOTNieDZwdWMifQ.M_XBqcEKA-BFF-AG9ZW_5Q';

  var jsMap = document.querySelector('#js-map');
  if (jsMap) {
    var map = new mapboxgl.Map({
      container: jsMap,
      style: 'mapbox://styles/isserg/cjomx48pj92fk2st9b0712bk1',
      center: mamCenter,
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      scrollZoom: false
    });
  }
  
})();