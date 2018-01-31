var map;
var tile_layer;
var vector_layer;
var projection;
var infoPanel;
var locationInfo;
var locationsDataURL = 'http://localhost/wheresourwater/data/locations.json';

(function() {
    setup_map();

    add_controls();

    add_listeners();

    fetchLocationInfo();
    
})();


function setup_map() {
    infoPanel = document.getElementById("info-panel");

    map = new ol.Map({ });

    map.setTarget('map');

    tile_layer = new ol.layer.Tile({
      // source: new ol.source.MapQuest({layer: 'osm'})
      source: make_map_source('Bing', [])
    })
    map.addLayer(tile_layer);

    projection = tile_layer.getSource().getProjection();
    // console.log('projection: ', projection);

    var view = new ol.View({
        center: [-33.951333, 18.559162],
        zoom: 1, //9,
        projection: projection
    })
    map.setView(view);
    // console.log('map projection: ', map.getView().getProjection());
}


function add_controls() {
    var fullscreen_control = new ol.control.FullScreen();
    map.addControl(fullscreen_control);
     
    // var zoom_slider_control = new ol.control.ZoomSlider();
    // map.addControl(zoom_slider_control);
     
    var zoom_control = new ol.control.Zoom();
    map.addControl(zoom_control);
}


function add_listeners() {
    document.getElementById("map").addEventListener("click", function( event ) {
        var pixel = map.getEventPixel(event);
        var features = map.getFeaturesAtPixel(pixel);
        // console.log('features: ', features);

        infoPanel.setAttribute('aria-expanded', 'true');

        // var popup = new ol.Overlay({
        //   element: document.getElementById('popup')
        // });
        // popup.setPosition(features[0].getGeometry().getCoordinates());
        // popup.setPositioning('bottom-center');
        // popup.setOffset([0, -10]);
        // map.addOverlay(popup);
    }, false);


    var closeButton = document.querySelectorAll('[role="close"]')[0];
    closeButton.addEventListener("click", function( event ) {
        infoPanel.setAttribute('aria-expanded', 'false');
    }, false);
}


function addFeatures() {
    create_features();

    map.addLayer(vector_layer);

    var features_extent = vector_layer.getSource().getExtent();
    // console.log('features_extent: ', features_extent);
    map.getView().fit(features_extent);
}


function create_features() {
    var features = [];

    for (var id in locationInfo) {
        if (locationInfo.hasOwnProperty(id)) {
            // console.log('locationInfo[id]: ', locationInfo[id]);
            var point_feature = new ol.Feature({ });

            var point_geom = new ol.geom.Point(
              locationInfo[id].coords
            );
            point_feature.setGeometry(point_geom);

            features.push(point_feature);
        }
    }

    if (features.length == 0) {
        throw 'No features';
    }

    vector_layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      })
    })

    features.forEach(transform_geometry);

    var fill = new ol.style.Fill({
      color: [255, 255, 255, 1]
    });
     
    var stroke = new ol.style.Stroke({
      color: [220, 220, 220, 1],
      width: 1
    });

    var style = new ol.style.Style({
      image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: 6
      }),
      fill: fill,
      stroke: stroke
    });
    vector_layer.setStyle(style);
}


function transform_geometry(element) {
    var current_projection = new ol.proj.Projection({code: "EPSG:4326"});
 
    element.getGeometry().transform(current_projection, projection);
}


/**
 * @param string type
 * @param array parameters
 */
function make_map_source(type, parameters) {
    // console.log('type: ', type);
    switch (type) {
      case 'OSM':
        // MapQuest Open Street Maps
        return new ol.source.MapQuest({layer: 'osm'});
        break;

      case 'Bing':
        // BingMaps

        // TYPES ________________________________
        // Aerial             Aerial
        // AerialWithLabels   Aerial with labels
        // Road               Road
        // collinsBart        Collins Bart
        // ordnanceSurvey     Ordnance Survey

        return new ol.source.BingMaps({
          imagerySet: 'Aerial', // EPSG:3857
          key: 'Alv8UVrw4GpMxdqDyfVK8js_wa56fdUPFhZF7eUPSTiPVsry3kdyIQcr-U5upHIN'
        });
        break;

      default:
        break;
    }
}


function fetchLocationInfo() {
    getJSON(locationsDataURL, function(err, data) {
        if (err !== null) {
            alert('Something went wrong fetching the location data: ' + err);
            return null;
        }

        // console.log('data: ', data);
        locationInfo = data;

        addFeatures();
    });
}


function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      }
      else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
}