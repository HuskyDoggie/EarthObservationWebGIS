var layer = new Array() // Map中的图层数组
var layerName = new Array() // 图层名称数组
var layerVisibility = new Array // 图层可见属性数组

// 加载图层列表的数据
function loadLayersControl(map, id) {
    var treeContent = document.getElementById(id); //  图层列表容器
    var layers = map.getLayers(); // 获取地图中的所有图层
    console.log(layers);
    console.log(layers.getLength());
    console.log(layers.item(0))
    for (var i = 0; i < layers.getLength(); i++) {
        // 获取每个图层的名称以及是否可见的属性
        layer[i] = layers.item(i);
        // console.log(layer[i])
        layerName[i] = layer[i].get('name');
        // console.log(layerName[i])
        layerVisibility[i] = layer[i].getVisible();
        console.log(layerName[i])
        console.log(layerVisibility[i]);
        //  新增li元素，用于承载图层项
        var elementLi = document.createElement('li');
        // console.log(elementLi);
        treeContent.appendChild(elementLi); // 添加li子节点

        // 创建复选框元素
        var elementInput = document.createElement('input');
        elementInput.type = 'checkbox';
        elementInput.name = 'layers';
        elementLi.appendChild(elementInput);

        // 创建label元素
        var elementLabel = document.createElement('label');
        elementLabel.className = 'layer';

        // 设置图层名称
        setInnerText(elementLabel, layerName[i]);
        elementLi.appendChild(elementLabel);

        //  设置图层默认显示状态
        if (layerVisibility[i]) {
            elementInput.checked = true;
        }
        // 为checkbox 添加变更事件监听
        addChangeEvent(elementInput, layer[i]);
    }
}
// 为checkbox 元素绑定变更事件
function addChangeEvent(element, layer) {
    element.onclick = function () {
        if (element.checked) {
            layer.setVisible(true); // 显示图层
        } else {
            layer.setVisible(false); // 不显示图层
        }
    }
}

function setInnerText(element, text) {
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}



extent = ol.proj.transformExtent([104.02706459270323, 30.62000133211866, 104.27789665475748, 30.7531153596184], 'EPSG:4326', 'EPSG:3857')
console.log(extent);
var map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [104.13352894164491, 30.695178501004563],
        zoom: 13,
        extents: extent
    })
});


var tilelayer1 = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: false
})
tilelayer1.set('name', 'OSM 地图')
map.addLayer(tilelayer1)


var satelliteLayer = new ol.layer.Tile({ //天地图卫星图
    visible: true,
    source: new ol.source.XYZ({
      url: 'http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=7786923a385369346d56b966bb6ad62f',
      crossOrigin:"anonymous"
    })
});
satelliteLayer.set('name', '天地图卫星图')
map.addLayer(satelliteLayer)

var classfilayer = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',

        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            "STYLES": '',
            "LAYERS": 'EarthObservation:classification2',
            "exceptions": 'application/vnd.ogc.se_inimage',
            tilesOrigin: 11584169.088349134 + "," + 3561586.4367540376
        }
    })
})
console.log('classfilayer', classfilayer);

classfilayer.set('name', '非监督分类结果')
map.addLayer(classfilayer)

var edge = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',
        params: {
            'LAYERS': 'EarthObservation:edge',
            'TILED': true,
        },
        serverType: 'geoserver',
        hidpi: true
    })
})
edge.set('name', '成华区边界')
map.addLayer(edge)

// var datalayer = new ol.layer.Tile({
//     visible: false,
//     source: new ol.source.TileWMS({
//         url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',
//         params: {
//             'LAYERS': 'EarthObservation:chq',
//             'TILED': true,
//         },
//         serverType: 'geoserver',
//         hidpi: true
//     })
// })
// datalayer.set('name', 'Our Data')
// map.addLayer(datalayer)


// var untiled = new ol.layer.Image({
//     source: new ol.source.ImageWMS({
//         ratio: 1,
//         url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',
//         params: {
//             'FORMAT': 'image/png',
//             'VERSION': '1.1.0',
//             "STYLES": '',
//             "LAYERS": 'EarthObservation:classification',
//             "exceptions": 'application/vnd.ogc.se_inimage',
//         }
//     })
// });
// map.addLayer(untiled)

// var tiled = new ol.layer.Tile({
//     visible: false,
//     source: new ol.source.TileWMS({
//         url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',
//         params: {
//             'FORMAT': 'image/png',
//             'VERSION': '1.1.0',
//             tiled: true,
//             "STYLES": '',
//             "LAYERS": 'EarthObservation:classification',
//             "exceptions": 'application/vnd.ogc.se_inimage',
//             tilesOrigin: 11584169.088349134 + "," + 3561586.4367540376
//         }
//     })
// });
// map.addLayer(tiled)



var grass = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',

        params: {
            'LAYERS': 'EarthObservation:version03_grass',
            'TILED': true,
        },
        serverType: 'geoserver',
        hidpi: true
    })
})
grass.set('name', '绿地')
map.addLayer(grass)

var buildings = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',

        params: {
            'LAYERS': 'EarthObservation:version03_buildings',
            'TILED': true,
        },
        serverType: 'geoserver',
        hidpi: true
    })
})
buildings.set('name', '建筑')
map.addLayer(buildings)


var water = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',

        params: {
            'LAYERS': 'EarthObservation:version3_water',
            'TILED': true,
        },
        serverType: 'geoserver',
        hidpi: true
    })
})
water.set('name', '水域')
map.addLayer(water)

var highway = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: 'http://81.69.245.34:8080/geoserver/EarthObservation/wms',

        params: {
            'LAYERS': 'EarthObservation:highway',
            'TILED': true,
        },
        serverType: 'geoserver',
        hidpi: true
    })
})
highway.set('name', '道路')
map.addLayer(highway)




loadLayersControl(map, 'layerTree')

// 解除地图双击缩小事件
const dblClickInteraction = map
    .getInteractions()
    .getArray()
    .find(interaction => {
        return interaction instanceof ol.interaction.DoubleClickZoom;
    });
map.removeInteraction(dblClickInteraction);