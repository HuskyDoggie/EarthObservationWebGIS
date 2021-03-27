var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
//绘制geojson矢量图层样式
var geoJsonStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#e6d933',
        lineDash: [4],
        width: 3
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.4)'
    })
});
//绘制geojson矢量图层高亮样式
var geoJsonHLightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#33CCFF',
        lineDash: [4],
        width: 3
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.4)'
    })
});

var geoserverUrl = 'http://81.69.245.34:8080/geoserver/EarthObservation';
var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: geoJsonStyle
});
map.addLayer(geojsonLayer)

var webLayer = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',
        params: {
            'LAYERS': 'EarthObservation:chq',
            'TILED': true
        },
        serverType: 'geoserver',
        hidpi: true
    })
})

map.addOverlay(overlay)

var clickfun = function (evt) {
    geojsonLayer.setSource(new ol.source.Vector({}))

    content.innerHTML = '';
    // console.log(evt.coordinate);
    var viewResolution = map.getView().getResolution();
    // console.log(viewResolution);

    // console.log(webLayer.getSource().urls[0])
    var url = webLayer.getSource().getFeatureInfoUrl(
        evt.coordinate, viewResolution, 'EPSG:4326', {
            'INFO_FORMAT': 'application/json'
        })

    // console.log(url);

    if (url) {
        $.ajax({
            type: "post",
            url: url,
            dataType: 'json',
            success: function (data) {
                if (data.features.length > 0) {
                    geojsonLayer.setSource(new ol.source.Vector({
                        features: (new ol.format.GeoJSON()).readFeatures(data)
                    }))
                    geojsonLayer.setStyle(geoJsonHLightStyle)
                    var feature = data.features[0]
                    var name = feature.properties.name
                    if (name === null) {
                        name = '未标注的地物'
                    }
                    content.innerHTML = '名称：' + name + '<br>' +
                        '面积:' + feature.properties.area +'平方米'+
                        '</br>' + '<a href="https://www.baidu.com/s?wd=' + name + '" target="_blank">点击查看详情</a>'
                    overlay.setPosition(evt.coordinate)
                } else {
                    console.log('no feature');
                    overlay.setPosition(undefined)
                }
            },
            error(err) {
                console.log(err);
            }
        })

    }
}
map.on('singleclick',clickfun)