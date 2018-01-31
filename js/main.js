// self executing function here
(function() {

    var map = new ol.Map({ });

    map.setTarget('map');

    var view = new ol.View({
        center: [-33.951333, 18.559162],
        zoom: 9
    })
    map.setView(view);

    var tile_layer = new ol.layer.Tile({
      // source: new ol.source.MapQuest({layer: 'osm'})
      source: make_map_source('Bing', [])
    })
    map.addLayer(tile_layer);

    map.getView().setZoom(2);

})();


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