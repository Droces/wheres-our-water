var map;
var tile_layer;
var vector_layer;

(function() {

    map = new ol.Map({ });

    map.setTarget('map');

    var view = new ol.View({
        center: [-33.951333, 18.559162],
        zoom: 1 //9
    })
    map.setView(view);

    tile_layer = new ol.layer.Tile({
      // source: new ol.source.MapQuest({layer: 'osm'})
      source: make_map_source('Bing', [])
    })
    map.addLayer(tile_layer);

    create_features();
    console.log('vector_layer: ', vector_layer);

    map.addLayer(vector_layer);

    var features_extent = vector_layer.getSource().getExtent();
    console.log('features_extent: ', features_extent);
    map.getView().fit(features_extent);

})();


function create_features() {

    var features = [];

    var locations = [
        [18.559162, -33.951333],
        [19.559162, -34.951333]
    ];

    for (var i = locations.length - 1; i >= 0; i--) {
        var point_feature = new ol.Feature({ });

        var point_geom = new ol.geom.Point(
          locations[i]
        );
        point_feature.setGeometry(point_geom);

        features.push(point_feature);
    }

    vector_layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      })
    })

    features.forEach(transform_geometry);

    var fill = new ol.style.Fill({
      color: [180, 0, 0, 0.3]
    });
     
    var stroke = new ol.style.Stroke({
      color: [180, 0, 0, 1],
      width: 1
    });

    var style = new ol.style.Style({
      image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: 8
      }),
      fill: fill,
      stroke: stroke
    });
    vector_layer.setStyle(style);
}


function transform_geometry(element) {
    var current_projection = new ol.proj.Projection({code: "EPSG:4326"});
    var new_projection = tile_layer.getSource().getProjection();
 
    element.getGeometry().transform(current_projection, new_projection);
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
          imagerySet: 'AerialWithLabels', // EPSG:3857
          key: 'Alv8UVrw4GpMxdqDyfVK8js_wa56fdUPFhZF7eUPSTiPVsry3kdyIQcr-U5upHIN'
        });
        break;

      default:
        break;
    }
}