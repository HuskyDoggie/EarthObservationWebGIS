//监听地图鼠标移动事件
var after_seach =  function (e) {
    if (e.dragging) {
        return;
    }
    var feature = map.forEachFeatureAtPixel(e.pixel,
        function (feature) {
            return feature;
        });
    if (feature == undefined) { //捕捉不到矢量数据，设置矢量图层默认样式
        geojsonLayer.getSource().forEachFeature(function (feature) {
            feature.setStyle(geoJsonStyle);
        });
        //隐藏气泡窗口
        overlay.setPosition(undefined);
        closer.blur();
    } else { //捕捉到矢量数据，设置矢量图层高亮样式
        feature.setStyle(geoJsonHLightStyle);
        //弹出气泡窗口
        var coordinate = e.coordinate;
        content.innerHTML = '名称:' + feature.values_.name + '</br>面积:' + feature.values_.area +'平方米'+
            '</br>' + '<a href="https://www.baidu.com/s?wd=' + feature.values_.name + '" target="_blank">点击查看详情</a>'
        overlay.setPosition(coordinate);
    }
}


$("#research_btn").click(function () {
    overlay.setPosition(undefined);
    var keyword = $("#textName").val();
    console.log(keyword);
    queryByProperty(keyword, 'EarthObservation:data_version4', callbackLastQueryWFSService);
});
/*属性查询图层
propertyValue：用户输入的关键字
typename
 */
function queryByProperty(propertyValue, typeName, callback) {
    var urlString = geoserverUrl + '/ows';
    var param = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: typeName,
        outputFormat: 'application/json',
        cql_filter: "name='" + propertyValue + "'",
    };

    var geojsonUrl = urlString + getParamString(param, urlString);
    console.log(geojsonUrl);

    // 'http://81.69.245.34:8080/geoserver/EarthObservation/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=EarthObservation%3Atestwfs&maxFeatures=50&outputFormat=application%2Fjson'
    $.ajax({
        url: geojsonUrl,
        async: true,
        type: 'GET',
        dataType: 'json',
        success(result) {
            callback(result);
        },
        error(err) {
            alert(err);
        }
    })
}

function getParamString(obj, existingUrl, uppercase) {
    var params = [];
    for (var i in obj) {
        params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
    }
    return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
}
/*
 * 图层属性查询回调函数
 */
function callbackLastQueryWFSService(data) {
    if (data && data.features.length > 0) {
        feature = data.features[0];
        clearGeojsonLayer();
        loadGeojsonLayer(data);
        var extent = geojsonLayer.getSource().getExtent();
        if (extent) {
            map.getView().fit(extent);
        }
        map.on('dblclick',after_seach)
       
    } else {
        var keyword = $("#textName").val();
        alert('未搜索到“' + keyword + '”这个地方!,试试换个搜索词吧~')
    }
}
/*
 * 绘制图形函数
 */
function loadGeojsonLayer(geojson) {
    geojsonLayer.setSource(new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojson)
    }));
}
/*
 * 清空绘制图形函数
 */
function clearGeojsonLayer() {
    if (geojsonLayer && geojsonLayer.getSource()) {
        geojsonLayer.getSource().clear
    }
}