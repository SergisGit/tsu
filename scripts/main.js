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

    var graduatesData = jsMap.getAttribute('data-graduates');

    var map = new mapboxgl.Map({
      container: jsMap,
      style: 'mapbox://styles/isserg/cjomx48pj92fk2st9b0712bk1',
      center: mamCenter,
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      scrollZoom: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    $.getJSON(graduatesData, function (graduates) {

      map.on('load', function() {

        map.addSource('graduates', {
          type: 'geojson',
          data: graduates
        });

        var grPopup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'map__popup',
          offset: 25
        });

        var activeMarker;

        grPopup.on('close',function() {
          if (activeMarker) {
            activeMarker.classList.remove('map__marker--active');
          }
        });

        var iconTemplate = 'data:image/svg+xml;utf8,<svg version=\'1.0\' viewBox=\'0 0 24 24\' xml:space=\'preserve\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'><g fill=\'%230047FF\'><polygon points=\'12,3 1,9 12,15 23,9 \'/><polygon points=\'19,12.8 12,17 5,12.8 5,17.2 12,21 19,17.2 \'/><rect height=\'8\' width=\'2\' x=\'21\' y=\'9\'/></g></svg>';

        graduates.features.forEach(function(marker, i) {

          var icon = marker.properties.icon ? marker.properties.icon : iconTemplate;

          var el = document.createElement('div');
          el.id = "marker-" + i;
          el.className = 'map__marker';
          el.innerHTML = '<img src="'+icon+'" alt="graduate" class="map__marker-icon">';
  
          new mapboxgl.Marker(el, {offset: [0, 0]})
              .setLngLat(marker.geometry.coordinates)
              .addTo(map);
      
          el.addEventListener('click', function(e){
            e.stopPropagation();
  
            if (activeMarker) {
              activeMarker.classList.remove('map__marker--active');
            }
            activeMarker = this;
            this.classList.add('map__marker--active');

            var name = marker.properties.name ? marker.properties.name : 'Неизвестный';
            var imageSrc = marker.properties.image ? marker.properties.image : iconTemplate;
            var year = marker.properties.year ? '<div class="infowindow__year">’'+marker.properties.year+'</div>' : '';
            var place = marker.properties.place ? '<div class="infowindow__place">'+marker.properties.place+'</div>' : '';
            var link = marker.properties.link ? '<a href="'+marker.properties.link+'" class="infowindow__btn  btn">ЧИТАТЬ ИСТОРИЮ</a>' : '';

            grPopup.setHTML(
              '<div class="infowindow">'+
                '<div class="infowindow__image-wrapper">'+
                  '<img class="infowindow__image" src="'+imageSrc+'" alt="'+name+'">'+year+
                '</div>'+
                '<div class="infowindow__content">'+
                  '<div class="infowindow__name">'+name+'</div>'+place+link+
                '</div>'+
              '</div>'
            );
            grPopup.setLngLat({"lng": marker.geometry.coordinates[0], "lat": marker.geometry.coordinates[1]}).addTo(map);

            var el = grPopup._container;
            el.style.width='';
            el.style.height='';
            var width = Math.round(el.offsetWidth);
            if (width % 2 != 0) el.style.width=width+1+'px';
            var height = Math.round(el.offsetHeight);
            if (height % 2 != 0) el.style.height=height+1+'px';
          });
        });

        /*
        map.on('dragstart', function (event) {
          console.log(map.tap);
          if (event.originalEvent && 'touches' in event.originalEvent) {
            if (event.originalEvent.touches.length < 2) {
              map.dragPan.disable();
              map.dragPan.enable();
            }
          }
        });
        */
      });

    });

  }

  //Share-links
  var shareLink = $('.sharer');
  $.each(shareLink, function () {
    var thisLink = $(this);
    if (!thisLink.attr('data-url')) {
      thisLink.attr('data-url', window.location.href);
    }
    if (!thisLink.attr('data-title')) {
      thisLink.attr('data-title', $(document).find("title").text());
    }
  });

  //up btn
  var $root = $('html, body');

  var upBtn = $('#js-upBtn');
  upBtn.on('click', function() {
    $root.animate({
      scrollTop: 0
    }, 500);
    return false;
  });
  
})();